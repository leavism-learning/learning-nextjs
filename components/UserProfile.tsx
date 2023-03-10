import Image from 'next/image';

export default function UserProfile ({ user }) {
    return (
        <div className="box-center">
              <Image
                src={user?.photoURL || '/hacker.png'}
                className="card-img-center"
                alt="User profile picture"
                height={150} width={150}>
              </Image>
              <p>
                <i>@{user.username}</i>
              </p>
              <h1>{user.displayName || 'Anonymous User'}</h1>
        </div>
    )
}