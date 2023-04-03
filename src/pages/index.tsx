/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState, useMemo, useEffect, useCallback } from "react";
import clsx from "clsx";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
import Translate, { translate } from "@docusaurus/Translate";
import { useHistory, useLocation } from "@docusaurus/router";
import { usePluralForm } from "@docusaurus/theme-common";
import { debounce } from "lodash";


import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import FavoriteIcon from "@site/src/components/svgIcons/FavoriteIcon";
import {
  sortedUsers,
  Tags,
  TagList,
  type User,
  type TagType,
} from "@site/src/data/users";
import Heading from "@theme/Heading";
import ShowcaseTagSelect, {
  readSearchTags,
} from "./_components/ShowcaseTagSelect";
import ShowcaseFilterToggle, {
  type Operator,
  readOperator,
} from "./_components/ShowcaseFilterToggle";
import ShowcaseCard from "./_components/ShowcaseCard/cn";
import ShowcaseTooltip from "./_components/ShowcaseTooltip";


import styles from "./styles.module.css";

const TITLE = translate({
  message: "ChatGPT Shortcut - 简单易用的 ChatGPT 快捷指令表，让生产力倍增！",
});
const DESCRIPTION = translate({
  message: "快速使用ChatGPT工作学习赚钱",
});

// 页面滚动使用
const innerH = window.innerHeight || 500
// 是否显示回顶部
// let [isShowToTop, setIsShowToTop] = useState<string | null>(null);

type UserState = {
  scrollTopPosition: number;
  focusedElementId: string | undefined;
};

function restoreUserState(userState: UserState | null) {
  const { scrollTopPosition, focusedElementId } = userState ?? {
    scrollTopPosition: 0,
    focusedElementId: undefined,
  };
  // @ts-expect-error: if focusedElementId is undefined it returns null
  document.getElementById(focusedElementId)?.focus();
  window.scrollTo({ top: scrollTopPosition });
}

export function prepareUserState(): UserState | undefined {
  if (ExecutionEnvironment.canUseDOM) {
    return {
      scrollTopPosition: window.scrollY,
      focusedElementId: document.activeElement?.id,
    };
  }

  return undefined;
}

const SearchNameQueryKey = "name";

function readSearchName(search: string) {
  return new URLSearchParams(search).get(SearchNameQueryKey);
}

function filterUsers(
  users: User[],
  selectedTags: TagType[],
  operator: Operator,
  searchName: string | null
) {
  if (searchName) {
    // eslint-disable-next-line no-param-reassign
    // 搜索范围
    users = users.filter((user) =>
      (user.title + user.description + user.descn + user.remark)
        .toLowerCase()
        .includes(searchName.toLowerCase())
    );
  }
  if (selectedTags.length === 0) {
    return users;
  }
  return users.filter((user) => {
    if (user.tags.length === 0) {
      return false;
    }
    if (operator === "AND") {
      return selectedTags.every((tag) => user.tags.includes(tag));
    }
    return selectedTags.some((tag) => user.tags.includes(tag));
  });
}

function useFilteredUsers() {
  const location = useLocation<UserState>();
  const [operator, setOperator] = useState<Operator>("OR");
  // On SSR / first mount (hydration) no tag is selected
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
  const [searchName, setSearchName] = useState<string | null>(null);
  // Sync tags from QS to state (delayed on purpose to avoid SSR/Client
  // hydration mismatch)
  useEffect(() => {
    setSelectedTags(readSearchTags(location.search));
    setOperator(readOperator(location.search));
    setSearchName(readSearchName(location.search));
    restoreUserState(location.state);
  }, [location]);

  return useMemo(
    () => filterUsers(sortedUsers, selectedTags, operator, searchName),
    [selectedTags, operator, searchName]
  );
}

function ShowcaseHeader() {
  return (
    <div className={styles["top-bg"]}>
      <img className={styles["top-img"]} src="https://prompt.redtom.com/static/imgs/index/bg.png" alt="背景图" />
      <section className={clsx("text--center", styles["top-text"])}>
        <Heading as="h1">ChatGPT提问模版</Heading>
        <p className={styles["top-p"]}>{DESCRIPTION}</p>
      </section>
    </div>
  );
}

function useSiteCountPlural() {
  const { selectMessage } = usePluralForm();
  return (sitesCount: number) =>
    selectMessage(
      sitesCount,
      translate(
        {
          id: "showcase.filters.resultCount",
          description:
            'Pluralized label for the number of sites found on the showcase. Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',
          message: "{sitesCount}个提示",
        },
        { sitesCount }
      )
    );
}

function ShowcaseFilters() {
  const filteredUsers = useFilteredUsers();
  const siteCountPlural = useSiteCountPlural();
  let [isExpand, setIsExpand] = useState<string | null>(null);
  const changeIsExpand = (statusVal: string): any => {
    // setIsExpand(statusVal)
  }
  // isUnfold = false
  return (
    <section className={clsx("container margin-top--l", styles["filter-view"])}>
      <div className={styles["filter-view-inner"]}>
        <div className={styles.filterCheckbox}>
          <div className={styles["filter-bar"]}>
            <Heading as="h2" className={styles.h2}>
              <Translate id="showcase.filters.title">筛选</Translate>
            </Heading>
            <span className={styles["total-span"]}>
              {siteCountPlural(filteredUsers.length)}
            </span>
          </div>
        </div>
        <div className={isExpand ? styles["filter-expand"] : styles["filter-retract"]}>
          <ul className={clsx("clean-list", styles.checkboxList)}>
            {TagList.map((tag, i) => {
              const { label, description, color } = Tags[tag];
              const id = `showcase_checkbox_id_${tag}`;
              const isFirstTag = i === 0;
              return (
                <li key={i} className={styles.checkboxListItem}>
                  <ShowcaseTooltip
                    id={id}
                    text={description}
                    anchorEl="#__docusaurus"
                  >
                    <ShowcaseTagSelect
                      tag={tag}
                      id={id}
                      label={label}
                      icon={
                        isFirstTag ? (
                          <FavoriteIcon svgClass={styles.svgIconFavoriteXs} />
                        ) : tag === "Favorite" ? (
                          <FavoriteIcon svgClass={styles.svgIconFavoriteXs} />
                        ) : (
                          <span
                            style={{
                              backgroundColor: color,
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              marginLeft: 8,
                              display: "inline-block",
                            }}
                          />
                        )
                      }
                    />
                  </ShowcaseTooltip>
                </li>
              );
            })}
          </ul>
        </div>
       {/*  {isExpand ? 
          <div className={clsx(styles.icon, styles.retract)} onClick={changeIsExpand('retract')}>收起</div> 
        :
          <div className={clsx(styles.icon, styles.expand)} onClick={changeIsExpand('expand')}>展开</div>} */}
      </div>
    </section>
  );
}

const favoriteUsers = sortedUsers.filter((user) =>
  user.tags.includes("Favorite")
);
const otherUsers = sortedUsers.filter(
  (user) => !user.tags.includes("Favorite")
);

function SearchBar() {
  const history = useHistory();
  const location = useLocation();
  const [value, setValue] = useState<string | null>(null);
  let [inputStatus, setInputStatus] = useState<string | null>(null);
  useEffect(() => {
    setValue(readSearchName(location.search));
  }, [location]);

  useEffect(() => {
    const searchbar = document.getElementById("searchbar");
    if (searchbar) {
      searchbar.focus();
    }
  }, [value]);

  const updateSearch = useCallback(
    debounce((searchValue: string) => {
      const newSearch = new URLSearchParams(location.search);
      newSearch.delete(SearchNameQueryKey);
      if (searchValue) {
        newSearch.set(SearchNameQueryKey, searchValue);
      }
      history.push({
        ...location,
        search: newSearch.toString(),
        state: prepareUserState(),
      });
    }, 800), //搜索延时
    [location, history]
  );

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    if (window.innerWidth >= 768) {
      // PC 端
      setValue(e.currentTarget.value);
      updateSearch(e.currentTarget.value);
    } else {
      // 移动端
      setValue(e.currentTarget.value);
      const newSearch = new URLSearchParams(location.search);
      newSearch.delete(SearchNameQueryKey);
      if (e.currentTarget.value) {
        newSearch.set(SearchNameQueryKey, e.currentTarget.value);
      }
      history.push({
        ...location,
        search: newSearch.toString(),
        state: prepareUserState(),
      });
    }
  };
  const handleBlur = (e: React.FormEvent<HTMLInputElement>) => {
    setInputStatus('searchCenterBlur')
  }
  const handleFocus = (e: React.FormEvent<HTMLInputElement>) => {
    setInputStatus('searchCenterFocus')
  }

  return (
    <div className={styles.searchContainer}>
      <div className={clsx(styles.searchCenter, inputStatus ? styles[inputStatus] : '')}>
        <div className={styles.searchmagnifier}>
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M24.1402 14.666C24.1402 19.8982 19.8987 24.1397 14.6665 24.1397C9.43433 24.1397 5.19282 19.8982 5.19282 14.666C5.19282 9.43384 9.43433 5.19233 14.6665 5.19233C19.8987 5.19233 24.1402 9.43384 24.1402 14.666ZM21.7154 24.3785C19.7364 25.8173 17.3005 26.666 14.6665 26.666C8.03908 26.666 2.6665 21.2934 2.6665 14.666C2.6665 8.03859 8.03908 2.66602 14.6665 2.66602C21.2939 2.66602 26.6665 8.03859 26.6665 14.666C26.6665 17.5054 25.6803 20.1145 24.0318 22.1694L29.3466 27.4841C30.0714 28.2089 30.1524 29.303 29.5276 29.9279C28.9027 30.5527 27.8086 30.4717 27.0838 29.7469L21.7154 24.3785Z"
              fill="#b4b4b4"
            />
          </svg>
        </div>
        <input
          id="searchbar"
          placeholder={translate({
            message: "搜索",
            id: "showcase.searchBar.placeholder",
          })}
          value={value ?? undefined}
          onInput={handleInput}
          onBlur={handleBlur}
          onFocus={handleFocus}
        />
      </div>
    </div>
  );
}

function ShowcaseCards() {
  const filteredUsers = useFilteredUsers();

  if (filteredUsers.length === 0) {
    return (
      <section className="margin-top--lg margin-bottom--xl">
        <div className="container padding-vert--md text--center">
          <Heading as="h2">
            <Translate id="showcase.usersList.noResult">
              😒 找不到结果，请缩短搜索词
            </Translate>
          </Heading>
          <SearchBar />
        </div>
      </section>
    );
  }

  return (
    <section className="margin-top--lg margin-bottom--xl">
      {filteredUsers.length === sortedUsers.length ? (
        <>
          <div className={styles.showcaseFavorite}>
            <div className="container">
              <div
                className={clsx(
                  "margin-bottom--md",
                  styles.showcaseFavoriteHeader
                )}
              >
                <Heading as="h2">
                  <Translate id="showcase.favoritesList.title">
                    热门
                  </Translate>
                </Heading>
                <FavoriteIcon svgClass={styles.svgIconFavorite} />
                <SearchBar />
              </div>
              <ul className={clsx("clean-list", styles.showcaseList)}>
                {favoriteUsers.map((user, index) => (
                  <ShowcaseCard key={index} user={user} />
                ))}
              </ul>
            </div>
          </div>
          <div className="container">
            <Heading as="h2" className={styles.showcaseHeader}>
              <Translate id="showcase.usersList.allUsers">全部</Translate>
            </Heading>
            <ul className={clsx("clean-list", styles.showcaseList)}>
              {otherUsers.map((user, index) => (
                <ShowcaseCard key={index} user={user} />
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="container">
          <div
            className={clsx("margin-bottom--md", styles.showcaseFavoriteHeader)}
          >
            <SearchBar />
          </div>
          <ul className={clsx("clean-list", styles.showcaseList)}>
            {filteredUsers.map((user, index) => (
              <ShowcaseCard key={index} user={user} />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
const scrollPage = (e:any) => {
  const isShow = e.target.scrollTop >= innerH * 2 ? 'show' : 'hide'
  // setIsShowToTop(isShow)
  console.log(e.target.scrollTop, 'scrollPage')
}
export default function Showcase(): JSX.Element {
  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <main className={clsx('margin-vert--lg', styles['index-page'])} onScroll={scrollPage}>
        <ShowcaseHeader />
        <ShowcaseFilters />
        <ShowcaseCards />
        {/* <ShowSuspendBtn :isShowToTop={isShowToTop === 'show'}/> */}
      </main>
    </Layout>
  );
}
