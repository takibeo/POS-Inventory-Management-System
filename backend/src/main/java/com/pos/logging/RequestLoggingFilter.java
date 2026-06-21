package com.pos.logging;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Enumeration;

@Slf4j
@Component
public class RequestLoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String method = request.getMethod();
        String uri = request.getRequestURI();
        String query = request.getQueryString();
        String remote = request.getRemoteAddr();

        StringBuilder sb = new StringBuilder();
        sb.append("Incoming request: ").append(method).append(" ").append(uri);
        if (query != null) sb.append('?').append(query);
        sb.append(" from ").append(remote);

        // log selected headers
        sb.append(" | headers=[");
        Enumeration<String> names = request.getHeaderNames();
        boolean first = true;
        while (names != null && names.hasMoreElements()) {
            String name = names.nextElement();
            if (!first) sb.append(", ");
            sb.append(name).append('=').append(request.getHeader(name));
            first = false;
        }
        sb.append("]");

        log.info(sb.toString());

        filterChain.doFilter(request, response);

        int status = response.getStatus();
        log.info("Response for {} {} -> status={}", method, uri, status);
    }
}
