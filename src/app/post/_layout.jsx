import { Stack } from "expo-router"

const PostDetailsLayout = ()=>{
    return <Stack>
        <Stack.Screen name="[id]" options={{
            headerTitle: "Post Details"
        }} />
    </Stack>
}
export default PostDetailsLayout