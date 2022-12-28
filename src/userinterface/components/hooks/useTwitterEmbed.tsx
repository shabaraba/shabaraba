import {useRef, useEffect} from 'react';

export default () => {
  const containerRef = useRef(null)
  useEffect(()=>{
    (window as any).twttr?.widgets?.load(containerRef.current) // ツイートの埋め込みを実行
  }, [])

  return containerRef;
}

