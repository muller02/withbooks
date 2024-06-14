package kr.withbooks.web.service;

import java.io.File;
import java.io.IOException;
import java.util.List;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import kr.withbooks.web.entity.BookshortsAttachment;
import kr.withbooks.web.repository.BookshortsAttachmentRepository;
import org.springframework.web.multipart.MultipartFile;

@Service
public class BookshortsAttachmentServiceImp implements BookshortsAttachmentService{

    @Autowired
    private BookshortsAttachmentRepository repository;

    @Value("${fileupload.contextPath}")
    private String contextPath;


    @Override
    public void add(List<MultipartFile> files, HttpServletRequest request, Long shortsId) {


        String fileName = null;
        System.out.println("파일이름 = " + files.size());

        for(int i=0; i<files.size(); i++){


            if (!files.get(i).isEmpty()) {

                fileName = files.get(i).getOriginalFilename();
                System.out.println("파파파일 이름 = " + fileName);

                 //                String path = "/image/shorts";
                //                String realPath = request.getServletContext().getRealPath(path);
                String realPath = contextPath  + "shorts";

                File file = new File(realPath);
                if(!file.exists())
                    file.mkdirs();

                File filePath = new File(realPath+File.separator+fileName);

                try {
                    files.get(i).transferTo(filePath);
                } catch (IOException e) {
                    e.printStackTrace();

                }


                BookshortsAttachment shortsAttachment =BookshortsAttachment.builder().shortsId(shortsId).img(fileName).build();
                //for문을 돌면서 다중 파일 이미지 이름을 db(shorts_attachment)에 저장
                repository.save(shortsAttachment);

            }

        }




    }

    @Override
    public List<BookshortsAttachment> getListById(Long id) {
        // 북쇼츠 id와 같은 attachment 객체 리스트를 가지고 온다.


        return repository.findAllById(id);
    }

    @Override
    public void delete(Long sid, List<String> imgPaths , HttpServletRequest request) {

        if(imgPaths !=null) {
            // 해당 파일이미지 삭제
            for (String imgPath : imgPaths) {
                System.out.println("이미지 펫 = "  + imgPaths);

                repository.remove(sid, imgPath);


                // 서버에 이미지를 저장할 경로를 구하기
//                String realPath = request
//                        .getServletContext()
//                        .getRealPath("/image/shorts/" + imgPath);

                String realPath = contextPath  + "shorts/"+imgPath;


                File file = new File(realPath);
                if (file.exists()) {
                    if (file.delete()) {
                        System.out.println("File deleted successfully: " + request);

                    } else {
                        System.out.println("Failed to delete the file: " + realPath);

                    }
                } else {
                    System.out.println("File does not exist: " + realPath);

                }
            }


        }


    }
}
