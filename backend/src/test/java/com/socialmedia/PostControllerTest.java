//package com.socialmedia;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.socialmedia.dto.PostRequest;
//import com.socialmedia.model.Post;
//import com.socialmedia.service.PostService;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.http.MediaType;
//import org.springframework.test.web.servlet.MockMvc;
//
//import static org.hamcrest.Matchers.any;
//import static org.mockito.Mockito.when;
//import static org.springframework.mock.http.server.reactive.MockServerHttpRequest.post;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//@SpringBootTest
//@AutoConfigureMockMvc
//class PostControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    @MockBean
//    private PostService postService;
//
//    @Test
//    void testCreatePost() throws Exception {
//        // Arrange
//        PostRequest postRequest = new PostRequest();
//        postRequest.setCaption("Test post");
//
//        when(postService.createPost(any(PostRequest.class))).thenReturn(new Post());
//
//        // Act & Assert
//        mockMvc.perform(post("/api/posts")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(objectMapper.writeValueAsString(postRequest)))
//                .andExpect(status().isCreated());
//    }
//}