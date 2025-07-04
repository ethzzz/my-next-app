// 封装一个图片上传的api
import { http } from '@/app/utils/axios';

export interface ImageInfo {
  link: string;
  name: string;
  id: string;
}

export async function uploadImageApi(file: File): Promise<ImageInfo> {
  const formData = new FormData();
  formData.append('file', file);
  // 假设后端返回 { link, name, id }
  const res = await http.post('/upload', {
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  console.log(res);
  const { link, name, id } = res.data || {};
  debugger;
  return { link, name, id };
}
