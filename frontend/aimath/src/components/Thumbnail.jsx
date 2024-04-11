import { XIcon } from "@heroicons/react/solid";
import axios from "axios";
import {useUploadedFileContext} from "@/context/UploadedFileContext";

const Thumbnail = ({ imgSrc, fileName }) => {
    const { uploadedFiles, deleteFile, uploadedFilesCloud, deleteFileCloud } = useUploadedFileContext();

    function deleteUploadedFile() {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/image/delete`
        const headers = {
            // 'Content-Type': 'multipart/form-data',
            'Authorization': `eyJraWQiOiIzMExoR1YrMnYwZVRpcHMyUFZid3F1d1FYSHdKS3JaYnRLSnhcL2hGMEs4ND0iLCJhbGciOiJSUzI1NiJ9.eyJvcmlnaW5fanRpIjoiNmM0NjE0MzctZjAzOC00Y2E1LTlhNzItODA4NTUyNDg2YjNkIiwic3ViIjoiNDE5ZjkzOGQtNTNhNy00MjI1LTlhNmEtZTIxNDczYjYwMTA1IiwiYXVkIjoiMWRjcDI0aGo3a3BvY3VxbGllZm1yYWE5amQiLCJldmVudF9pZCI6ImMwNjlhMTNiLTQ2NjgtNGU0ZC1iZmNhLWU2NjY0ZTcwOTU1YSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzEyNzg1ODk3LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtY2VudHJhbC0xLmFtYXpvbmF3cy5jb21cL2V1LWNlbnRyYWwtMV9xcFBxSk54R2oiLCJjb2duaXRvOnVzZXJuYW1lIjoic2hpcm9kaW1hIiwiZXhwIjoxNzEyODcyMjk3LCJpYXQiOjE3MTI3ODU4OTcsImp0aSI6IjlhNDIwMjBmLTExNjgtNGVjYS1hOWIyLWE5Y2YxMmZkNzZjMCJ9.MLtEWkviepPOK5_qe1-JqbyZROr4iRjB1Ow55sRd_GLzVo3Mv-3R5wWlFXrmoIsFknEhDSEl9F_Pd2_8t4mjWB9G5YVY2Uh517sPRZGvKzQW-mFCyLYlCyVzL23GPG2fBHDPsClUmqxpB1pEWdcwfdYNM202FUlfVq90IFa_2GVeP_KrRVWkmaNmcVsYuGPB_I4aiyTCaFwCtudmz79htyN9yeeH7FFUkHMkAq9PSQETzuzzz-w0qmXWIj4GS-dItQ14io3mlho8a8390Gf2OoQzXsRxW8ng-xfAH5W8wjOErs3ca_YRVACSAR97LQfixMNQ8CgepQQIi8h1AMpiyQ`
        }

        axios
            .delete(`${url}?file_name=${fileName}`, { headers })
            .then((response) => {
                if (response.status === 200) {
                    deleteFileCloud(
                        uploadedFilesCloud.filter(
                            (file) => file.name !== fileName
                        )
                    );
                    deleteFile(
                        uploadedFiles.filter((file) => file.name !== fileName)
                    );
                } else {
                    throw new Error(
                        "An error occurred while trying to delete the image"
                    );
                }
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