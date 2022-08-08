import React from "react";
import {bemBlock} from "shared/lib";
import "./app.scss";

export function App() {
    const block = bemBlock("App");
    return (
        <div className={block()}>
            <h1>Video events saga will be here soon...</h1>
        </div>
    );
};
