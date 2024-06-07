package kr.withbooks.web.service;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import kr.withbooks.web.entity.FreeAttachment;
import kr.withbooks.web.entity.FreeBoard;
import kr.withbooks.web.entity.FreeBoardView;
import kr.withbooks.web.repository.FreeAttachmentRepository;
import kr.withbooks.web.repository.FreeBoardRepository;

@Service
public class FreeBoardServiceImp implements  FreeBoardService{

    @Autowired
    private FreeBoardRepository repository;

    @Autowired
    private FreeAttachmentRepository freeAttachmentRepository;

    @Value("${fileupload.contextPath}")
    private String contextPath;
    

    @Override
    public List<FreeBoardView> getList(Long withId, int page, String sort) {
        int limit = 10;
        int offset = (page - 1) * limit;
        List<FreeBoardView> list = repository.findAll(withId, page, sort, limit, offset);

        return list;
    }

    @Override
    public int getCount(Long withId) {
        return repository.count(withId);
    }

    @Override
    public FreeBoard getById(Long freeBoardId) {
        return repository.findById(freeBoardId);
    }

    @Override
    public Long reg(FreeBoard freeBoard, MultipartFile[] imgs, HttpServletRequest request) {

        // DB에 freeboard 저장
        repository.save(freeBoard);
        
        Long boardId = freeBoard.getId();

        // 이미지가 왔다면
        if(!imgs[0].isEmpty()){
            
            // DB에 이미지 저장
            for(MultipartFile img : imgs){
                String savedPath = "/image/free-board/" + String.valueOf(boardId) + "/" + img.getOriginalFilename();
                freeAttachmentRepository.save(boardId, savedPath);
            }


            // // 이미지 파일을 서버에 저장
            // // 서버에 이미지를 저장할 경로를 구하기
            // String realPath = request
            //         .getServletContext()
            //         .getRealPath("/image/free-board/" + String.valueOf(boardId));
            
            String realPath = contextPath + String.valueOf(boardId);

            File dir = new File(realPath);
            if(!dir.exists())
                dir.mkdirs();


            // 서버에 이미지를 저장
            for(MultipartFile img : imgs){
                String pathToSave = realPath + File.separator + img.getOriginalFilename();

                File imgFile = new File(pathToSave);

                try {
                    img.transferTo(imgFile);
                } catch (IllegalStateException | IOException e) {
                 e.printStackTrace();
                }
            }
        }

        return boardId;
    }

    @Override
    public Long delete(Long id) {
        return repository.remove(id);
    }

    @Override
    public int edit(FreeBoard freeBoard, MultipartFile[] imgs,  HttpServletRequest request) {


        //////////////// 게시글 /////////////////

        // DB에 freeboard 저장
        repository.update(freeBoard);
        Long boardId = freeBoard.getId();


        //////////////// 이미지 /////////////////


        // 이미지가 왔다면
        // 이전의 저장된 이미지들 서버와 DB에서 삭제
        // 새 이미지 파일을 서버와 DB에 저장
        if(!imgs[0].isEmpty())
        {

            // // 서버에 이미지를 저장할 경로를 구하기
            //  String realPath = request
            //         .getServletContext()
            //         .getRealPath("/image/free-board/" + String.valueOf(boardId));

            String realPath = contextPath + String.valueOf(boardId);
    
            File dir = new File(realPath);
            if(!dir.exists())
                dir.mkdirs();



            // 게시글에 대한 이전에 저장된 이미지들을 전부 삭제 -> 서버에 있는 바이너리 데이터 지우기 & DB에 있는 이미지 경로 지우기
            

            // 서버에 있는 바이너리 데이터 지우기
            List<FreeAttachment> freeAttachmentList = freeAttachmentRepository.findAll(boardId);
            
            for(FreeAttachment f : freeAttachmentList){
                String imgPath = f.getImg();
                String[] imgNameToken = imgPath.split("/");
                String imgName = imgNameToken[imgNameToken.length - 1];
                
                String savedPath = realPath + File.separator + imgName;
                File file = new File(savedPath);
                file.delete();

                System.out.println(savedPath + "경로에 해당하는 " + imgName + " 삭제 완료");
            }

            // DB에 있는 이미지 경로 지우기
            freeAttachmentRepository.remove(boardId);
            System.out.println(boardId + "(ID) 게시글에 해당하는 이미지들을 DB에서 삭제했습니다.");



            // 서버에 새 이미지를 저장
            for(MultipartFile img : imgs){
                String pathToSave = realPath + File.separator + img.getOriginalFilename();
                File imgFile = new File(pathToSave);
            
                try {
                    img.transferTo(imgFile);
                } catch (IllegalStateException | IOException e) {
                    e.printStackTrace();
                }
            }

            // DB에 새 이미지를 저장
            for(MultipartFile img : imgs){
                String savedPath = "/image/free-board/" + String.valueOf(boardId) + "/" + img.getOriginalFilename();
                freeAttachmentRepository.save(boardId, savedPath);
            }
            
        }
        
        return 1;
    }

    @Override
    public List<FreeBoardView> getNoticeList(Long withId) {
        return repository.findAllNotice(withId);
    }
}
