// import { useState, useEffect, Children } from "react";
// import axios from "axios";
// import "./App.css";

// function App(): JSX.Element {

//   const [posts, setPosts] = useState<any>([]);
//   const [id, setId] = useState<any>("");
//   const [postById, setPostById] = useState<any>({});
//   const [username, setUsername] = useState<any>("");
//   const [contents, setContents] = useState<any>("");
//   const [comment, setComment] = useState<any>("");
//   const [formatComments, setFormatComments] = useState<any>([]);

//   useEffect(() => {
//     const getPosts = async () => {
//       const res = await axios.get("http://localhost:8080/posts/posts");
//       setPosts(res.data);
//     };
//     getPosts();
//   }, []);

//   // fullComments.push(...comments.map((comment) => getChildren(comment)))

//   // function getChildren(comment: any, allComments: any) {
//   //   return {
//   //     ...comment,
//   //     children: allComments
//   //       .filter((c: any) => c.parentCommentId === comment._id)
//   //       .map((c: any) => getChildren(c, allComments))
//   //   };
//   // }

//   function getChildren(c: any, mapp: Map<any, any>) {

//     // const children = mapp.get(c?._id);
//     // if (children) {
//     // console.log(mapp?.get(c?._id));
//     return {
//       ...c,
//       children: mapp?.get(c?._id)?.map((e: any) => { return getChildren(e, mapp); })
//     };
//     // }

//     // return "boooomax";
//   }

//   const getMap = (com: any) => {
//     const byParent = new Map();
//     for (const comment of com.commentReplies) {
//       let children = byParent.get(comment.parentCommentId);
//       if (!children) {
//         children = [];
//         byParent.set(comment.parentCommentId, children);
//       }
//       children.push(comment);
//     }
//     return byParent;
//   };

//   useEffect(() => {
//     let formattedArray: any = [];
//     if (id) {
//       const getPostById = async () => {
//         const res = await axios.get(`http://localhost:8080/posts/posts/${id}`);
//         setPostById(res.data);
//         //  console.log(res.data.comments[1]);
//         const data = {
//           comments: [
//             {
//               zzz: "1111"
//             },
//             {
//               commentReplies: [
//                 {
//                   _id: "firstOne",
//                   parentCommentId: ""
//                 },
//                 {
//                   _id: "secondOne",
//                   parentCommentId: "firstOne"
//                 },
//                 {
//                   _id: "TESTETSTSST",
//                   parentCommentId: "firstOne"
//                 },
//                 {
//                   _id: "TEST 2",
//                   parentCommentId: "firstOne"
//                 },
//                 {
//                   _id: "thirdOne",
//                   parentCommentId: "secondOne"
//                 },
//                 {
//                   _id: "finalOne",
//                   parentCommentId: "thirdOne"
//                 },
//                 {
//                   _id: "123",
//                   parentCommentId: ""
//                 },
//                 {
//                   _id: "test",
//                   parentCommentId: "123"
//                 }
//               ]
//             }
//           ]
//         };

//         const map = getMap(data.comments[1]);
//         // console.log(res.data);
//         // @ts-ignore
//         console.log(getChildren(data.comments[1].commentReplies[0], map));
//       };

//       getPostById();
//     }
//   }, [id]);

//   const createPost = async () => {
//     await axios.post("http://localhost:8080/posts/createPost", {
//       contents: contents,
//       username: username
//     });
//   };

//   const handleComment = async () => {
//     await axios.post(`http://localhost:8080/posts/commentPost/${postById.post._id}`, {
//       username: "user2",
//       contents: comment
//     });
//   };

//   const handleNestedComment = async (id: any) => {
//     await axios.post(`http://localhost:8080/posts/commentReply/${postById.post._id}/${id}`, {
//       username: "user4",
//       contents: comment
//     });
//   };

//   return (
//     <div className="App">
//       <input type="text" placeholder="username" onChange={(e): any => setUsername(e.target.value)} />
//       <input type="text" placeholder="contents" onChange={(e): any => setContents(e.target.value)} />
//       <input type="button" value="CREATE!" onClick={(): any => createPost()} />
//       <br></br>
//       <h3>POSTS:</h3>
//       <div style={{ border: "2px solid grey" }}>
//         {posts.length &&
//           posts.map((e: any) => {
//             return (
//               <div key={e.contents}>
//                 <input type="button" value={e.contents} onClick={() => {
//                   setId(e._id);
//                 }} />
//                 <p>Likes: {e.nLikes} | Comments: {e.nComments}</p>
//               </div>
//             );
//           })
//         }
//       </div>
//       <h3> POST BY ID: </h3>
//       {
//         Object.values(postById).length &&
//         <div style={{ border: "2px solid grey" }}>
//           <p>{postById.post.contents}</p>
//           <p>{postById.post.createdBy}</p>
//           <p>Likes: {postById.post.nLikes} | Comments: {postById.post.nComments}</p>
//           <input type="text" placeholder="COMMENT" onChange={(e) => setComment(e.target.value)} />
//           <input type="button" value="reply" onClick={() => handleComment()} />
//           {/* {postById.comments.map((e: any) => {
//             return (
//               <div key={e._id._id}>
//                 <p>{e._id.contents}</p>
//                 <p>By: {e._id.userId} likes: {e.nLikes}</p>
//                 <input type="input" placeholder="reply" onChange={(e) => setComment(e.target.value)} />
//                 <input type="button" value="submit" onClick={() => handleNestedComment(e._id._id)} />
//                 {formatComments.length &&
//                   formatComments.map((a: any, i: any) => {
//                     console.log(a);
//                     return (<></>);
//                     // a.map((ez) => {
//                     //   return (
//                     //     <div key={ez._id} style={ez.depth === 0 ? { border: "2px solid red" } : ez.depth === 1 ? { border: "2px solid blue" } : ez.depth === 2 ? { border: "2px solid green" } : { border: "2px solid pink" }}>
//                     //       <p>{ez.contents}</p>
//                     //       <p>{ez.userId}</p>
//                     //       {/* <input type="input" placeholder="reply" onChange={(e) => setComment(e.target.value)} />
//                     //       <input type="button" value="submit" onClick={() => handleNestedComment(ez._id)} /> */}
//           {/* //     </div> */}
//           {/* //   );
//                     // });
//           //         })
//           //       }
//           //     </div> */}
//           {/* //   );
//           })} */}
//           {formatComments.length &&
//             formatComments.map((e) => {
//               //console.log(e);
//               return (
//                 <div key={e.parent.contents}>
//                   <p>Parent Comment</p>
//                   <p>{e.parent.contents}</p>
//                   <p>{e.parent.userId}</p>
//                   <input type="input" placeholder="reply" onChange={(e) => setComment(e.target.value)} />
//                   <input type="button" value="submit" onClick={() => handleNestedComment(e.parent._id)} />
//                   {e.formatted.map((ez, i) => {
//                     //   console.log(ez);
//                     return (
//                       <div key={ez._id} style={ez.depth === 0 ? { border: "2px solid red" } : ez.depth === 1 ? { border: "2px solid blue" } : ez.depth === 2 ? { border: "2px solid green" } : { border: "2px solid pink" }}>
//                         <p>{ez.contents}</p>
//                         <p>{ez.userId}</p>
//                         <p>{ez.depth}</p>
//                         <input type="input" placeholder="reply" onChange={(e) => setComment(e.target.value)} />
//                         <input type="button" value="submit" onClick={() => handleNestedComment(ez._id)} />
//                       </div>
//                     );
//                   })}
//                 </div>
//               );
//             })
//           }
//         </div>
//       }
//     </div>
//   );
// }

// export default App;
