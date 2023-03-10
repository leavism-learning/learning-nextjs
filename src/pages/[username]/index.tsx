import UserProfile from '../../../components/UserProfile';
import PostFeed from '../../../components/PostFeed';
import { firestore, getUserWithUsername, postToJSON } from 'lib/firebase';
import { collection, CollectionReference, DocumentData, getDocs, limit, orderBy, Query, query, where } from 'firebase/firestore';

export async function getServerSideProps(serverQuery) {
    const { username } = serverQuery.query ;
    const userDocument = getUserWithUsername(username);

     let user = null;
     let posts = null;

     if (userDocument) {
        user = (await userDocument).data();
        const postsCollection: CollectionReference = collection(firestore, 'posts');
        const postsQuery = query(postsCollection,
            where('published', '==', true),
            orderBy('createdAt', 'desc'),
            limit(5)
            );
        posts = (await getDocs(postsQuery)).docs.map(postToJSON)
     }

    return {
        props: { user, posts },
    }
}

export default function UserProfilePage({ user, posts }) {
    return (
        <main>
            <UserProfile user={user} />
            <PostFeed posts={posts} />
        </main>
    )
}