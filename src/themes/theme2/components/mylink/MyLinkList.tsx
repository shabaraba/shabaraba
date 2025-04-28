import React from 'react';
import styles from './MyLinkList.module.css';
import { MyLinkEntity } from '../../../../core/entities/MyLinkEntity';
import MyLinkItem from './MyLinkItem';

interface MyLinkListProps {
  mylinks: MyLinkEntity[];
}

/**
 * MyLinks一覧コンポーネント（theme2用）
 */
export default function MyLinkList({ mylinks }: MyLinkListProps) {
  return (
    <div className={styles.mylinkList}>
      {mylinks.map((mylink) => (
        <MyLinkItem key={mylink.id} mylink={mylink} />
      ))}
    </div>
  );
}
