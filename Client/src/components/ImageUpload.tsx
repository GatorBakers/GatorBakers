// import { useState, type ChangeEvent } from 'react';
import UploadIcon from '../assets/ImageUpload.svg';

const ImageUpload = () => {
    // const [imgSrc, setImgSrc] = useState<string | null>(null);

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        console.log('Drag over');
    }

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
    }

    // const handleImgInput = (e: ChangeEvent<HTMLInputElement>) => {
    //     console.log(e.target.files);
    // }

    // const handleFiles = (files: FileList) => {
    // }

    const uploadContent = (
        <label 
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className='img-upload' htmlFor='img-upload'>
            <img src={UploadIcon} alt='Upload' />
            <span>Upload an Image</span>
            <input type='file' id='img-upload'/>
        </label>
    )

    return uploadContent;
};

export default ImageUpload;