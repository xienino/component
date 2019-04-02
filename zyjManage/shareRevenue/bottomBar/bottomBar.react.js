import React from 'react';
import style from './bottomBar.less';
import tool from 'comp/tool';
const lcns = tool.__classNameWithStyle.bind(tool, style);
import Pages from 'components/listPage.react';

const BottomBar = ({ pageStart, total, pageSize, setCurrentPage }) => {
    if (total > pageSize) {
        var pageDom = (
            <Pages
                pageLength={Math.ceil(total / pageSize)}
                setCurrentPage={setCurrentPage}
                defaultPage={pageStart+1}
            />
        )
    }
    
    let bottomTip = getTrans('totalPieces'/*共{1}条*/, total);
    return (
        <div className={lcns(['bottomBar'])}>
            <div className={lcns(['totalUserNumber'])}>
                {bottomTip}
            </div>
            <div className={lcns(['page'])}>
                {pageDom}
            </div>
        </div>
    )
}

export default BottomBar