import { FunctionItem, FunctionItemHeader, FunctionItemContent} from "@/components/FunctionItem";
import React, { useState, useRef } from "react";
import { Button } from "antd";

export function ScreenRecording() {

    // 录制的视频流
    const [stream, setStream] = useState<MediaStream | null>(null);
    // recorder
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    // 录制的视频
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

    // 开始录制
    const handleStartRecording = async () => {
        const st = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true
        });
        setStream(st);

        const recorder = new MediaRecorder(st);
        setMediaRecorder(recorder);
        // 初始化录制的视频
        let chunks: Blob[] = [];
        recorder.addEventListener('dataavailable', (e) => {
            console.log('dataavailable.....')
            if (e.data.size > 0) {
                chunks.push(e.data)
                console.log('e.data', e.data);
                setRecordedChunks((prev) =>{
                    const updatedChunks = [...prev, e.data];
                    return updatedChunks;
                });
            }
        });
        recorder.addEventListener('stop', ()=>{
            if(typeof window !== 'undefined'){
                const blob = new Blob(chunks, { type: 'video/mp4' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'recording.webm';
                a.click();
            }
            setStream(null);
        });
        recorder.start();
    }

    // 结束录制
    const handleEndRecording = () => {
        // 关闭录制
        mediaRecorder?.stop();
        // 关闭视频流
        stream?.getTracks().forEach(track => track.stop());
        setStream(null);
    }

    return (
        <FunctionItem>
            <FunctionItemHeader>ScreenRecording</FunctionItemHeader>
            <FunctionItemContent>
                <Button style={{marginRight:'10px'}} onClick={handleStartRecording} disabled={!!stream}> { stream ? '正在录制中' : '开始录制' }</Button>
                <Button onClick={handleEndRecording}>结束录制</Button>
            </FunctionItemContent>
        </FunctionItem>
    )
}

ScreenRecording.displayName = "ScreenRecording"