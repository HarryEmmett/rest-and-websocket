import { Button, Card, CardBody, CardFooter, CardHeader, Heading, Text } from "@chakra-ui/react";
import { ArrowDownIcon, ArrowUpIcon, ChatIcon } from "@chakra-ui/icons";
import { IPosts } from "../../types/types";
import { useNavigate } from "react-router-dom";

interface PostCardProps {
    contents: IPosts
}
const PostCard: React.FC<PostCardProps> = ({ contents }): JSX.Element => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/${contents._id}/post`);
    };

    return (
        <div>
            <Card align='center'>
                <CardHeader>
                    <Heading size='md'>created {contents.createdAt}  createdBy {contents.createdBy} </Heading>
                </CardHeader>
                <CardHeader>
                    <Heading size='md'>{contents.title}</Heading>
                </CardHeader>
                <CardBody>
                    <Text>{contents.contents}</Text>
                </CardBody>
                <CardFooter>
                    <div>
                        <ArrowUpIcon />
                        <div>{contents.nLikes}</div>
                        <ArrowDownIcon />
                    </div>
                    <Button colorScheme='blue' onClick={handleClick}>View here</Button>
                    <div>
                        <ChatIcon />
                        {contents.nComments}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default PostCard;