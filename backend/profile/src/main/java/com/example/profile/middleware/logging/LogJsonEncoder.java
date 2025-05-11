package com.example.profile.middleware.logging;

import java.io.IOException;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.encoder.EncoderBase;

public class LogJsonEncoder extends EncoderBase<ILoggingEvent> {
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

    @Override
    public byte[] encode(ILoggingEvent event) {
        try {
            ObjectNode logNode = buildLogNode(event);
            String logJson = OBJECT_MAPPER.writeValueAsString(logNode);
            return (logJson + "\n").getBytes();
        } catch (IOException e) {
            addError("Failed to encode log event", e);
            return null;
        }
    }

    private ObjectNode buildLogNode(ILoggingEvent event) {
        ObjectNode logNode = OBJECT_MAPPER.createObjectNode();
        String timestamp = Instant.ofEpochMilli(event.getTimeStamp()).atOffset(ZoneOffset.UTC).format(ISO_FORMATTER);
        logNode.put("timestamp", timestamp);
        logNode.put("level", event.getLevel().toString());
        logNode.put("logger", event.getLoggerName());
        logNode.put("thread", event.getThreadName());
        logNode.put("message", event.getFormattedMessage());

        if (event.getThrowableProxy() != null) {
            logNode.put("exception", event.getThrowableProxy().getMessage());
        }

        for (Map.Entry<String, String> entry : event.getMDCPropertyMap().entrySet()) {
            logNode.put(entry.getKey(), entry.getValue());
        }

        return logNode;
    }

    @Override
    public byte[] footerBytes() {
        return new byte[0];
    }

    @Override
    public byte[] headerBytes() {
        return new byte[0];
    }
}
