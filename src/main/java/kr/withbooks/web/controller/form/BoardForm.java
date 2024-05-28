package kr.withbooks.web.controller.form;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Data
public class BoardForm {

    @NotNull(message = "토론 주제를 선택해 주세요")
    private Long topicId;
    @NotEmpty(message = "제목을 입력해 주세요")
    private String title;
    @NotEmpty(message = "내용을 입력해 주세요")
    private String content;

    private List<MultipartFile> files = new ArrayList<>();

}
