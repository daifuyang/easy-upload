import { Assets, ChooseModal, ChooseModalRef } from "@nextcms/easy-upload/src";
import zhCN from "antd/locale/zh_CN";

import "./App.css";
import { Button, ConfigProvider } from "antd";
import { useRef } from "react";

function App() {

  const chooseRef = useRef<ChooseModalRef>(null)

  return (
    <ConfigProvider locale={zhCN}>
      <ChooseModal ref={chooseRef} />
      <div className="container">
        <div className="code-demo">
          {/* <div
            style={{
              marginBottom: "24px"
            }}
          >
            <Button onClick={ () => {
              chooseRef.current?.open({title:"选择图片"})
            } }>选择器</Button>
          </div> */}
          <Assets listRequest={ async () => {
            return {
              data: new Array(10).fill(0),
              success: true
            }
          } } />
        </div>
      </div>
    </ConfigProvider>
  );
}

export default App;
