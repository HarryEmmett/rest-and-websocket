import "./PostsScroll.css";
import { useEffect, useState } from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import PostCard from "../../components/PostCard/PostCard";
import { getNumberOfPosts } from "../../API/postApi";
import { IAuthProvider, IPosts } from "../../types/types";
import { useAuth } from "../../hooks/AuthProvider/AuthProvider";
import AlertBanner from "../../components/AlertBanner/AlertBanner";

const PostsScroll: React.FC = (): JSX.Element => {

    const { user } = useAuth() as IAuthProvider;
    const [data, setData] = useState<IPosts[]>([]);
    const [total, setTotal] = useState<number | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);
    
    useEffect(() => {
        getNumberOfPosts(user.token, { from: 0, to: 9 }).then((res) => {
            setData(res.posts);
            setTotal(res.total);
            console.log(total);
        }
        ).catch(e => setError(e.message));
    }, []);

    return (
        <div id="postsScroll-container" className="postsScroll-container">
            <Grid
                templateAreas={`"header header"
                  "nav main"
                  "nav footer"`}
                gridTemplateRows={"0px 1fr 0px"}
                gridTemplateColumns={"30% 1fr"}
                h='100%'
                gap='0'
                color='blackAlpha.700'
                fontWeight='bold'
            >
                <GridItem pl='2' pr='2' bg='green.300' area={"main"} gap='10'>
                    {!!data.length &&
                        data.map((res) => {
                            return (
                                <GridItem pt='2'>
                                    <PostCard contents={res} />
                                </GridItem>
                            );
                        })}
                </GridItem>
                <GridItem pl='2' bg='pink.300' area={"nav"}>
                    Activity
                </GridItem>
            </Grid>
            {error && <AlertBanner error={error} success={false} />}
        </div>
    );
};

export default PostsScroll;