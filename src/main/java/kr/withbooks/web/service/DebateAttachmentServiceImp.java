package kr.withbooks.web.service;

import kr.withbooks.web.entity.DebateAttachment;
import kr.withbooks.web.repository.DebateAttachmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class DebateAttachmentServiceImp implements DebateAttachmentService {

    private final DebateAttachmentRepository debateAttachmentRepository;

    @Override
    public void add(Long boardId, List<DebateAttachment> debateAttachments) {

        log.info("boardId: {}, debateAttachments: {}", boardId, debateAttachments);

        if (CollectionUtils.isEmpty(debateAttachments)) {
            return;
        }

        for (DebateAttachment debateAttachment : debateAttachments) {
            debateAttachment.setBoardId(boardId);
        }

        log.info("debateAttachments: {}", debateAttachments);

        debateAttachmentRepository.save(debateAttachments);

    }

    @Override
    public List<DebateAttachment> getAllFileByBoardId(Long boardId) {
        return debateAttachmentRepository.findAllByBoardId(boardId);
    }

    @Override
    public List<DebateAttachment> getAllFileByIds(List<Long> ids) {

        log.info("ids: {}", ids);

        if (CollectionUtils.isEmpty(ids)) {
            return Collections.emptyList();
        }
        return debateAttachmentRepository.findAllByIds(ids);
    }

    @Override
    public void deleteAllFileByIds(List<Long> ids) {

        log.info("ids: {}", ids);

        if (CollectionUtils.isEmpty(ids)) {
            return;
        }
        debateAttachmentRepository.deleteAllByIds(ids);
    }



}
