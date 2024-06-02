package kr.withbooks.web.service;

import java.io.File;
import java.util.List;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.withbooks.web.entity.BookshortsAttachment;
import kr.withbooks.web.repository.BookshortsAttachmentRepository;

@Service
public class BookshortsAttachmentServiceImp implements BookshortsAttachmentService{

    @Autowired
    private BookshortsAttachmentRepository repository;

    @Override
    public void add(BookshortsAttachment shortsAttachment) {

        repository.save(shortsAttachment);


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

                repository.remove(sid, imgPath);


                // 서버에 이미지를 저장할 경로를 구하기
                String realPath = request
                        .getServletContext()
                        .getRealPath("/image/shorts/" + imgPath);

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
