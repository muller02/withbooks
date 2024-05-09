package kr.withbooks.web.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookshortsView {
    private long id;
    private long bookId;
    private long userId;
    private String content;

    private LocalDateTime regDate;
    private int blindYn;
    private List<String> img;
    private int likeCnt;
    private int commentCnt;
    private String userNickname;
    private String userImg;
    private String bookTitle;
    private String liked;
}