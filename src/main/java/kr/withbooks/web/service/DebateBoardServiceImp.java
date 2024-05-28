package kr.withbooks.web.service;

import kr.withbooks.web.entity.DebateBoard;
import kr.withbooks.web.entity.DebateBoardView;
import kr.withbooks.web.repository.DebateBoardRepository;
import kr.withbooks.web.repository.DebateBoardViewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DebateBoardServiceImp implements DebateBoardService {

    private final DebateBoardViewRepository debateBoardViewRepository;
    private final DebateBoardRepository debateBoardRepository;

    @Override
    public List<DebateBoardView> getList(Long roomId, Long topicId) {
        List<DebateBoardView> list = debateBoardViewRepository.findAllById(roomId, topicId);
        return list;
    }

    @Override
    public DebateBoard getById(Long id) {
        DebateBoard debateBoard = debateBoardRepository.findById(id);
        return debateBoard;
    }

    @Override
    public Long save(DebateBoard debateBoard) {
        debateBoardRepository.save(debateBoard);
        return debateBoard.getId();
    }

    @Override
    public void edit(Long id, DebateBoard updateBoard) {
        DebateBoard findBoard = debateBoardRepository.findById(id);
        findBoard.setTitle(updateBoard.getTitle());
        findBoard.setContent(updateBoard.getContent());
        debateBoardRepository.update(findBoard);
    }

    @Override
    public void deleteById(Long id) {
        debateBoardRepository.delete(id);
    }


}
