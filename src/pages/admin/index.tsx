import styles from '../../styles/Admin.module.css';

import AuthCheck from 'components/AuthCheck';
import PostFeed from 'components/PostFeed';
import { collection, doc, orderBy, query, serverTimestamp, writeBatch } from 'firebase/firestore';
import { UserContext } from 'lib/context';
import { auth, firestore } from 'lib/firebase';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';

import kebabCase from 'lodash.kebabcase';
import toast from 'react-hot-toast';

export default function AdminPostsPage(props) {
  return (
    <main>
      <AuthCheck>
        <PostList></PostList>
        <CreateNewPost></CreateNewPost>
      </AuthCheck>
    </main>
  );
}

function PostList() {
    const usersPostsCollection = collection(firestore, 'users', auth.currentUser!.uid, 'posts');
    const userPostsQuery = query(usersPostsCollection, 
        orderBy('createdAt'));
    const [querySnapshot] = useCollection(userPostsQuery);

    const posts = querySnapshot?.docs.map((doc) => doc.data());
    
    return (
        <>
            <h1>Manage your Posts</h1>
            <PostFeed posts={posts} admin />
        </>
    )
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState('')
  const slug = encodeURI(kebabCase(title))
  const isValidTitle = title.length > 3 && title.length < 100;

  async function createPost(event) {
    event.preventDefault();
    
    const uid = auth.currentUser!.uid;
    const postReference = doc(firestore, 'users', uid, 'posts', slug);

    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: '# Hello world!',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCout: 0,
    }

    const batch = writeBatch(firestore);
    batch.set(postReference, data);

    toast.success('Post created!');
    router.push(`/admin/${slug}`);
  }

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Article title"
        className={styles.input}>
      </input>
      <p><strong>Slug:</strong> { slug }</p>
      <button type='submit' disabled={!isValidTitle} className='btn-green'>
        Create new post
      </button>
    </form>
  )

}