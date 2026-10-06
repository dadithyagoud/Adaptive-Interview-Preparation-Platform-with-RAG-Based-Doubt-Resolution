package com.prepai.platform.dto;

import java.util.List;

public class ChatResponse {

    private String reply;
    private boolean grounded;
    private List<Citation> citations;

    public ChatResponse() {}

    public ChatResponse(String reply, boolean grounded, List<Citation> citations) {
        this.reply = reply;
        this.grounded = grounded;
        this.citations = citations;
    }

    public static class Citation {
        private String chunkId;
        private String title;
        private String source;
        private int matchPercentage;

        public Citation() {}

        public Citation(String chunkId, String title, String source, int matchPercentage) {
            this.chunkId = chunkId;
            this.title = title;
            this.source = source;
            this.matchPercentage = matchPercentage;
        }

        public String getChunkId() {
            return chunkId;
        }

        public void setChunkId(String chunkId) {
            this.chunkId = chunkId;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getSource() {
            return source;
        }

        public void setSource(String source) {
            this.source = source;
        }

        public int getMatchPercentage() {
            return matchPercentage;
        }

        public void setMatchPercentage(int matchPercentage) {
            this.matchPercentage = matchPercentage;
        }
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public boolean isGrounded() {
        return grounded;
    }

    public void setGrounded(boolean grounded) {
        this.grounded = grounded;
    }

    public List<Citation> getCitations() {
        return citations;
    }

    public void setCitations(List<Citation> citations) {
        this.citations = citations;
    }
}
