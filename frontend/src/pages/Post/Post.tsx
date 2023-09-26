import { Grid, GridItem } from "@chakra-ui/react";
import "./Post.css";

const Post: React.FC = (): JSX.Element => {
    return (
        <div id="post-container" className="post-container">
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
                <GridItem pl='2' bg='green.300' area={"main"}>
                    Post
                </GridItem>
                <GridItem pl='2' bg='pink.300' area={"nav"}>
                    Activity
                </GridItem>
            </Grid>
        </div>
    );
};

export default Post;