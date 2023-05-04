import { Box, Container } from "@mui/material";
import { CSSProperties, Fragment, useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import MessageInput from "../components/MessageInput";
import MessageStack from "../components/MessageStack";
import Sidebar from "../components/Sidebar";

export default function ChatPage() {
  const [inputHeight, setInputHeight] = useState(0);

  const inputRef = useRef<HTMLDivElement>(null);
  const stackBoxRef = useRef<HTMLDivElement>(null);
  const stackContainerRef = useRef<HTMLDivElement>(null);

  const prevBoxHeight = useRef(null);

  useEffect(() => {
    inputRef.current && setInputHeight(inputRef.current.clientHeight);
  }, [inputRef]);

  // useEffect(() => {
  //   const containerHeight = stackContainerRef.current?.clientHeight;
  //   const boxHeight = stackBoxRef.current?.clientHeight;
  //   const containerScrollTop = stackContainerRef.current?.scrollTop;

  //   if (!prevBoxHeight.current || containerScrollTop === prevBoxHeight.current - containerHeight) {
  //     stackContainerRef.current!.scrollTo({
  //       top: boxHeight! - containerHeight!,
  //       left: 0,
  //       behaviour: prevBoxHeight ? "smooth" : "auto",
  //     })
  //   }
  // });

  return (
    <Fragment>
      <Box sx={styledBox} component={"main"}>
        <Header />
        <Container
          component={"div"}
          ref={stackContainerRef}
          sx={{ marginBottom: `${inputHeight}px` }}
        >
          <Box component={"div"} ref={stackBoxRef}>
            <MessageStack />
          </Box>
        </Container>
        <Container ref={inputRef} sx={styledInputContainer}>
          <MessageInput />
        </Container>
      </Box>
      <Sidebar />
    </Fragment>
  );
}

const styledBox: CSSProperties = {
  position: "relative",
};
const styledInputContainer: CSSProperties = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
};
