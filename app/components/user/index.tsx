// 'use client'
// import styles from './user.module.scss'
// import { useUserStore } from '../../store/user'
// import Image from 'next/image'

// export function User(){
//     const { getUserInfo,logOut }  = useUserStore()
//     const user = getUserInfo()

//     const handleLogOut = ()=>{
//         logOut()
//     }
//     return (
//         <div className={styles['user']}>
//             <div className={styles['user-wrapper']}>
//                 <div className={styles['user-info']}>
//                     <div className={styles['user-avatar']}>
//                         <Image src={user.avatar || ''} alt="" />
//                     </div>
//                     <div className={styles['user-name']}>{user.username}</div>
//                 </div>
//             </div>
//             <div className={styles['logout-btn']} onClick={handleLogOut}>LogOut</div>
//         </div>
//     )
// }