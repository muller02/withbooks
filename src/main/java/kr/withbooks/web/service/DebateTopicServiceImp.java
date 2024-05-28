package kr.withbooks.web.service;

import kr.withbooks.web.entity.DebateTopic;
import kr.withbooks.web.repository.DebateTopicRepository;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class DebateTopicServiceImp implements DebateTopicService {

    private final DebateTopicRepository repository;
    private final DebateTopicRepository debateTopicRepository;

    @Override
    public DebateTopic getById(Long id) {
        DebateTopic debateTopic = repository.findById(id);
        return debateTopic;
    }

    @Override
    public List<DebateTopic> getList(Long roomId) {
        List<DebateTopic> list = repository.findAll(roomId);
        return list;
    }

    @Override
    public void add(DebateTopic debateTopic) {
        debateTopicRepository.save(debateTopic);
    }
}
