import { useState, type ChangeEvent } from 'react';
import UploadIcon from '../assets/ImageUpload.svg';
import CloseIcon from '../assets/CloseIcon.svg';
import './ImageUpload.css';

const ImageUpload = () => {
    const [imgSrc, setImgSrc] = useState<string | null>(null);

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        console.log('Drag over');
    }

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
    }

    const handleImgInput = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) handleFiles(e.target.files);
    }

    const handleFiles = (files: FileList) => {
        if (!files) return;
        const file = files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setImgSrc(reader.result as string);
        }
    }

    const uploadContent = (
        <label 
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className='img-upload' htmlFor='img-upload'>
            <img src={UploadIcon} alt='Upload' />
            <span>Upload an Image</span>
            <input onChange={handleImgInput} type='file' id='img-upload'/>
        </label>
    )

    const previewContent = (
        <div className='img-preview'>
            <img src={imgSrc ?? undefined} alt='' />
            <div className='overlay'>
                <button onClick={() => setImgSrc(null)} className='close-btn'>
                    <img src={CloseIcon} alt='Close' />
                </button>
            </div>
        </div>
    )

    return imgSrc ? previewContent : uploadContent;
};

export default ImageUpload;