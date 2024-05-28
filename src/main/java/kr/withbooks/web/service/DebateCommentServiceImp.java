package kr.withbooks.web.service;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.withbooks.web.entity.DebateComment;
import kr.withbooks.web.entity.DebateCommentView;
import kr.withbooks.web.repository.DebateCommentRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class DebateCommentServiceImp implements DebateCommentService {

    private final DebateCommentRepository debateCommentRepository;

    @Override
    public Long save(DebateComment debateComment) {
        debateCommentRepository.save(debateComment);
        return debateComment.getId();
    }

    @Override
    public DebateComment getById(Long id) {
        DebateComment debateComment = debateCommentRepository.findById(id);
        return debateComment;
    }

    @Override
    public List<DebateCommentView> getListById(Long boardId) {
        List<DebateCommentView> list = debateCommentRepository.findAllById(boardId);
        return list;
    }

    @Override
    public Long deleteById(Long id) {
        debateCommentRepository.deleteById(id);
        return id;
    }

    @Override
    public Long edit(Long id, DebateComment debateComment) {
        DebateComment findDebateComment = debateCommentRepository.findById(id);
        findDebateComment.setContent(debateComment.getContent());
        debateCommentRepository.update(findDebateComment);
        return id;
    }
}
