export const moodList = [
  { id: 1, label: '开心', img: 'https://messager-1304186209.cos.ap-nanjing.myqcloud.com/mood/2.png' },
  { id: 2, label: '伤心', img: 'https://messager-1304186209.cos.ap-nanjing.myqcloud.com/mood/3.png' },
  { id: 3, label: '悠闲', img: 'https://messager-1304186209.cos.ap-nanjing.myqcloud.com/mood/4.png' },
  { id: 4, label: '抑郁', img: 'https://messager-1304186209.cos.ap-nanjing.myqcloud.com/mood/5.png' },
  { id: 5, label: '兴奋', img: 'https://messager-1304186209.cos.ap-nanjing.myqcloud.com/mood/7.png' },
  { id: 6, label: '焦虑', img: 'https://messager-1304186209.cos.ap-nanjing.myqcloud.com/mood/8.png' },
  { id: 7, label: '孤独', img: 'https://messager-1304186209.cos.ap-nanjing.myqcloud.com/mood/9.png' },
  { id: 8, label: '平静', img: 'https://messager-1304186209.cos.ap-nanjing.myqcloud.com/mood/6.png' },
  { id: 9, label: '生气', img: 'https://messager-1304186209.cos.ap-nanjing.myqcloud.com/mood/10.png' },
  { id: 10, label: '无语', img: 'https://messager-1304186209.cos.ap-nanjing.myqcloud.com/mood/11.png' },
  { id: 11, label: '心动', img: 'https://messager-1304186209.cos.ap-nanjing.myqcloud.com/mood/12.png' },
  { id: 12, label: '其他', img: 'https://messager-1304186209.cos.ap-nanjing.myqcloud.com/mood/1.png' },
]

export function getMoodsLabel(mood: number) {
  return moodList.find((t: any) => t.id === mood)?.label
}

export function getMoodsImg(mood: number) {
  return moodList.find((t: any) => t.id === mood)?.img
}
