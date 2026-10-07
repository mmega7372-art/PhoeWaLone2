package com.example.demo.service;

import com.example.demo.model.Transaction;
import com.example.demo.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class ProgressService {

    @Autowired
    private TransactionRepository transactionRepository;

    public int calculateProgress(String userIdentifier, int courseLevel) {
        if (courseLevel == 0) {
            Optional<Transaction> userTx = transactionRepository.findByUserIdAndCourseId(userIdentifier, courseLevel);
            if (userTx.isPresent()) {
                return userTx.get().getProgressPercentage();
            }
            return 0;
        }
        return 0;
    }

    public Transaction saveOrUpdateTransaction(String userId, Integer courseId, Integer progressPercentage) {
        Optional<Transaction> existingTx = transactionRepository.findByUserIdAndCourseId(userId, courseId);
        
        Transaction tx;
        if (existingTx.isPresent()) {
            tx = existingTx.get();
            tx.setProgressPercentage(progressPercentage);
        } else {
            tx = new Transaction();
            tx.setId(userId);
            tx.setCourseId(courseId);
            tx.setProgressPercentage(progressPercentage);
        }
        
        return transactionRepository.save(tx);
    }
}