package kr.withbooks.web.service;

import kr.withbooks.web.entity.DebateRoom;
import kr.withbooks.web.entity.DebateRoomView;
import kr.withbooks.web.repository.DebateRoomRepository;
import kr.withbooks.web.repository.DebateRoomViewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DebateRoomServiceImp implements DebateRoomService {

    private final DebateRoomViewRepository debateRoomViewRepository;
    private final DebateRoomRepository debateRoomRepository;

    @Override
    public List<DebateRoomView> getList() {
        List<DebateRoomView> list = debateRoomViewRepository.findAll();
        return list;
    }

    @Override
    public DebateRoom getById(Long id) {
        return debateRoomRepository.findById(id, null);
    }

    @Override
    public DebateRoom getById(Long id, Long withId) {
        return debateRoomRepository.findById(id, withId);
    }

    @Override
    public List<DebateRoomView> getListById(Long withId) {
        List<DebateRoomView> list =  debateRoomViewRepository.findAllById(withId);
        return list;
    }

    @Override
    public Long add(DebateRoom debateRoom) {
        debateRoomRepository.save(debateRoom);
        return debateRoom.getId();
    }

    @Override
    public DebateRoomView getTopBoardCntbyId(Long withId) {
        return debateRoomViewRepository.findByWithId(withId);
    }

    @Override
    @Transactional
    public void deleteAll(Long withId, List<Long> ids) {
        debateRoomRepository.deleteAllById(withId, ids);
    }
}
