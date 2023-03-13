import styles from '../../styles/Post.module.css';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import PostContent from 'components/PostContent'
import { collectionGroup, doc, getDoc, getDocs } from "firebase/firestore";
import { firestore, getUserWithUsername, postToJSON } from "lib/firebase";

export async function getStaticProps({ params }: { params: { username: string, slug: string } }) {
    const { username, slug } = params;
    const userDoc = await getUserWithUsername(username);
    let post, path;

    if (userDoc) {
        const postRef = doc(firestore, 'users', userDoc.get('uid'), 'posts', slug);
        post = postToJSON(await getDoc(postRef));
        path = postRef.path;
    }

    return {
        props: { post, path },
        revalidate: 5000,
    }
}

export async function getStaticPaths() {
    const snapshot = await collectionGroup(firestore, 'posts');

    const paths = (await getDocs(snapshot)).docs.map((doc) => {
        const { slug, username } = doc.data();
        return {
            params: { username, slug },
        };
    });

    return {
        paths,
        fallback: 'blocking',
    };
}


export default function Post(props) {
    const postRef = doc(firestore, props.path);
    const [realtimePost] = useDocumentData(postRef);

    const post = realtimePost || props.post;

    return (
        <main className={styles.container}>

            <section>
                <PostContent post={post} />
            </section>

            <aside className="card">
                <p>
                    <strong>{post.heartCount || 0} 🤍</strong>
                </p>

            </aside>
        </main>
    );
}