import styles from '../../styles/Admin.module.css';
import AuthCheck from "components/AuthCheck";
import { auth, firestore } from "lib/firebase";

import { doc, DocumentData, DocumentReference, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useDocumentData } from "react-firebase-hooks/firestore";

import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useState } from "react";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';

export default function AdminPostEdit(props) {
    return (
        <AuthCheck>
            <PostManager></PostManager>
        </AuthCheck>
    )
}

function PostManager() {
    const [preview, setPreview] = useState(false);

    const router = useRouter();

    // TypeScript static typing error. This is a tempory work-around and should eventually be looked at
    // TODO: Look at the proper way to do this
    const { slug } = router.query as unknown as string;

    const uid = auth.currentUser!.uid;
    const postReference = doc(firestore, 'users', uid, 'posts', slug)
    const [post] = useDocumentData(postReference);

    return (
        <main className={styles.container}>
          {post && (
            <>
              <section>
                <h1>{post.title}</h1>
                <p>ID: {post.slug}</p>
    
                <PostForm postReference={postReference} defaultValues={post} preview={preview} />
              </section>
    
              <aside>
              <h3>Tools</h3>
                <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
                <Link href={`/${post.username}/${post.slug}`}>
                  <button className="btn-blue">Live view</button>
                </Link>
              </aside>
            </>
          )}
        </main>
      );
}

function PostForm({ defaultValues, postReference, preview }: { defaultValues: any, postReference: DocumentReference<DocumentData>, preview: any }) {
    const { register, handleSubmit, reset, watch } = useForm({ defaultValues, mode: 'onChange'});

    const updatePost = async ({ content, published }: { content: string, published: boolean}) => {
        await updateDoc(postReference, {
          content,
          published,
          updatedAt: serverTimestamp(),
        });

        reset({ content, published });

        toast.success('Post updated successfully!')
    }

    return (
        <form onSubmit={handleSubmit(updatePost)}>
          {preview && (
            <div className="card">
              <ReactMarkdown>{watch('content')}</ReactMarkdown>
            </div>
          )}
    
          <div className={preview ? styles.hidden : styles.controls}>
      
            <textarea name="content" {...register}></textarea>
    
            <fieldset>
              <input className={styles.checkbox} name="published" type="checkbox" {...register} />
              <label>Published</label>
            </fieldset>
    
            <button type="submit" className="btn-green">
              Save Changes
            </button>
          </div>
        </form>
      );
}