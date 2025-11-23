package com.waterball.lms.exception;

/**
 * Exception thrown when attempting to purchase a course that has already been purchased
 */
public class DuplicatePurchaseException extends RuntimeException {

    public DuplicatePurchaseException(String message) {
        super(message);
    }

    public DuplicatePurchaseException(String message, Throwable cause) {
        super(message, cause);
    }
}
