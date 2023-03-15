import Loader from 'components/Loader';
import Metatags from 'components/Metatags';
import PostFeed from 'components/PostFeed';
import { collectionGroup, getDocs, limit, orderBy, query, startAfter, where, Timestamp, DocumentData} from 'firebase/firestore';
import { firestore, postToJSON } from 'lib/firebase';
import Head from 'next/head'
import { useState } from 'react';

const LIMIT = 1;

export async function getServerSideProps(_context: any): Promise<any> {
  const postsCollection = collectionGroup(firestore, 'posts');
  const postsQuery = query(postsCollection,
    where('published','==', true),
    orderBy('createdAt', 'desc'),
    limit(LIMIT),
    );

  const posts = (await getDocs(postsQuery)).docs.map(postToJSON);
  return {
    props: { posts },
  }
}

export default function Home(props: { posts: any; }): JSX.Element {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  async function getMorePosts() {
    setLoading(true);
    
    const last = posts[posts.length - 1];
    const cursor = typeof last.createdAt === 'number' ? Timestamp.fromMillis(last.createdAt) : last.createdAt;
    const postsCollection = collectionGroup(firestore, 'posts');

    const postsQuery = query(postsCollection,
      where('published','==', true),
      orderBy('createdAt', 'desc'),
      startAfter(cursor),
      limit(LIMIT),
      );

    const newPosts: DocumentData[] = (await getDocs(postsQuery)).docs.map((doc) => {
      return doc.data();
    });

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  }

  return (
    <>
      <Head>
        <Metatags title='Homepage'></Metatags>
      </Head>
      <main>
        <PostFeed posts={posts} admin={undefined}/>

        {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}

        <Loader show={loading}/>

        {postsEnd && 'End of feed'}
      </main>
    </>
  )
}
