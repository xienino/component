import React, { useState, useEffect } from 'react';
import bs from 'data/service/boss';
import Search from 'components/search/search.react.js';


const SearchZyjUser = ({ searchUser, className }) => {
    const searchRef = React.createRef();

    const search = name => {
        if (name.length <= 0) {
            searchRef.current.setList([])
            searchUser(0)
        } else {
            bs.getUserByName({ name }).then(res => {
                searchRef.current.setList(res.obj.users)
            })
        }
    }

    return (
        <Search
            placeholder={getTrans('teacherAndStudengtName'/*老师/学生名*/)}
            associate
            search={search}
            ref={searchRef}
            className={className}
            searchUser={searchUser}
            totalValue
        />
    )
}

export default SearchZyjUser;