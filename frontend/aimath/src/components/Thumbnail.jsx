import { XIcon } from "@heroicons/react/solid";
import axios from "axios";
import {useUploadedFileContext} from "@/context/UploadedFileContext";

const Thumbnail = ({ imgSrc, fileName }) => {
    const { uploadedFiles, deleteFile, uploadedFilesCloud, deleteFileCloud } = useUploadedFileContext();

    function deleteUploadedFile() {
        axios
            .delete(`http://localhost:5000/image_delete?file_name=${fileName}`)
            .then((response) => {
                if (response.status === 200) {
                    deleteFileCloud(
                        uploadedFilesCloud.filter(
                            (file) => file.name !== fileName
                        )
                    );
                } else {
                    throw new Error(
                        "An error occurred while trying to delete the image"
                    );
                }
            })
            .finally(() => {
                deleteFile(
                    uploadedFiles.filter((file) => file.name !== fileName)
                );
            })
            .catch((error) => console.log(error));
    }

    return (
        <div className={'flex relative w-fit mx-0 h-full max-h-full transition ease-in-out delay-150 hover:opacity-50'}>
            <img
                src={imgSrc}
                alt={'uploaded image'}
                width={60}
                height={60}
                className={'rounded-2xl'}
            />
            <XIcon
                className={"absolute transition bg-contain bg-center ease-in-out delay-150 w-8 h-8 top-3.5 left-3 opacity-0 hover:opacity-100"}
                onClick={deleteUploadedFile}
            />
        </div>
    )
}

export default Thumbnail