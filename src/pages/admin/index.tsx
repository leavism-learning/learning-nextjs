import AuthCheck from 'components/AuthCheck';
import PostFeed from 'components/PostFeed';
import { collection, doc, getDocs, orderBy, query } from 'firebase/firestore';
import { auth, firestore } from 'lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';


export default function AdminPostsPage(props) {
  return (
    <main>
      <AuthCheck>
        <PostList></PostList>
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