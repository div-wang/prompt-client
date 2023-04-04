/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState, useRef, useMemo, useEffect, useCallback } from "react";
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
  message: "ChatGPT提问模版-快速使用ChatGPT工作学习赚钱",
});
const DESCRIPTION = translate({
  message: "快速使用ChatGPT工作学习赚钱",
});
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
      <img className={styles["top-img"]} src="https://tiwen.redtom.com/static/imgs/index/bg.png" alt="背景图" />
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
  const changeIsExpand = (): any => {
    setIsExpand('retract')
  }
  const changeIsRetract = (): any => {
    setIsExpand('expand')
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
        <div className={clsx('filter-bar', isExpand === 'expand' ? styles["filter-expand"] : styles["filter-retract"])}>
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
                        tag === "Favorite" ? (
                          <FavoriteIcon svgClass={styles.svgIconFavoriteXs} />
                        ) : ''
                      }
                    />
                  </ShowcaseTooltip>
                </li>
              );
            })}
          </ul>
        </div>
        {/* 展开收起 */}
        {/* {isExpand !== 'expand' ? 
          <div className={clsx(styles['expand-bar'], styles.retract)} onClick={changeIsRetract}>更多 
            <span className={styles['expand-bar-span']}>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.4088 1.33114C10.4088 1.46745 10.3588 1.60377 10.2587 1.70783L5.81676 6.32528C5.61673 6.53341 5.29207 6.53341 5.09202 6.32528L0.65016 1.70783C0.449947 1.4997 0.449947 1.16256 0.65016 0.954426C0.850187 0.746311 1.17485 0.746311 1.37489 0.954426L5.45438 5.1952L9.53393 0.954424C9.73396 0.74631 10.0586 0.746309 10.2587 0.954424C10.3588 1.0585 10.4088 1.19482 10.4088 1.33114Z" fill="#F13557" />
                <path d="M10.4088 5.64803C10.4088 5.78434 10.3588 5.92067 10.2587 6.02473L5.81676 10.6422C5.61673 10.8503 5.29207 10.8503 5.09202 10.6422L0.65016 6.02473C0.449947 5.8166 0.449947 5.47945 0.65016 5.27132C0.850187 5.06321 1.17485 5.06321 1.37489 5.27132L5.45438 9.51209L9.53393 5.27132C9.73396 5.0632 10.0586 5.0632 10.2587 5.27132C10.3588 5.37539 10.4088 5.51172 10.4088 5.64803Z" fill="#F13557" />
              </svg>
            </span>
          </div> 
        :
          <div className={clsx(styles['expand-bar'], styles.expand)} onClick={changeIsExpand}>收起 
            <span className={clsx(styles['expand-bar-span'], styles['expand-bar-up'])}>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.4088 1.33114C10.4088 1.46745 10.3588 1.60377 10.2587 1.70783L5.81676 6.32528C5.61673 6.53341 5.29207 6.53341 5.09202 6.32528L0.65016 1.70783C0.449947 1.4997 0.449947 1.16256 0.65016 0.954426C0.850187 0.746311 1.17485 0.746311 1.37489 0.954426L5.45438 5.1952L9.53393 0.954424C9.73396 0.74631 10.0586 0.746309 10.2587 0.954424C10.3588 1.0585 10.4088 1.19482 10.4088 1.33114Z" fill="#F13557" />
                <path d="M10.4088 5.64803C10.4088 5.78434 10.3588 5.92067 10.2587 6.02473L5.81676 10.6422C5.61673 10.8503 5.29207 10.8503 5.09202 10.6422L0.65016 6.02473C0.449947 5.8166 0.449947 5.47945 0.65016 5.27132C0.850187 5.06321 1.17485 5.06321 1.37489 5.27132L5.45438 9.51209L9.53393 5.27132C9.73396 5.0632 10.0586 5.0632 10.2587 5.27132C10.3588 5.37539 10.4088 5.51172 10.4088 5.64803Z" fill="#F13557" />
              </svg>
            </span>
          </div>} */}
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
export default function Showcase(): JSX.Element {
  let [isShowQrcode, setIsShowQrcod] = useState<string | null>(null);
  function qrcodeEnter() {
    setIsShowQrcod('show')
  }
  function qrcodeLeave() {
    setIsShowQrcod('hide')
  }
  // 页面滚动使用
  const innerH: number = 500
  let topView = useRef<HTMLDivElement>(null);
  let [isShowToTop, setIsShowToTop] = useState<boolean | null>(null);
  let scrollToTop = () => {
    if (topView && topView.current) {
      topView.current.scrollTop = 0
    }
  };
  let scrollPage = (e: any) => {
    const isShow = e.target.scrollTop >= innerH * 2
    setIsShowToTop(isShow)
  }
  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <main className={clsx('', styles['index-page'])} onScroll={scrollPage} ref={topView}>
        <ShowcaseHeader />
        <ShowcaseFilters />
        <ShowcaseCards />
        <section className={styles['suspend-view']}>
          <div className={styles['btn-chat']}
            onMouseEnter={qrcodeEnter}
            onMouseLeave={qrcodeLeave}>
            <svg className={styles.svg} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.46407 18.0164H5.98357V19.5359H4.46407V18.0164ZM6.92813 17.0719L6.92813 20.4805H3.51951L3.51951 17.0719H6.92813ZM7.07187 15.5524H3.37577C3.1951 15.5524 3.0162 15.5879 2.84929 15.6571C2.68237 15.7262 2.53071 15.8276 2.40295 15.9553C2.2752 16.0831 2.17386 16.2347 2.10472 16.4016C2.03559 16.5686 2 16.7475 2 16.9281L2 20.6242C2 20.9891 2.14495 21.339 2.40295 21.597C2.66096 21.8551 3.01089 22 3.37577 22H7.07187C7.25254 22 7.43144 21.9644 7.59835 21.8953C7.76527 21.8261 7.91693 21.7248 8.04468 21.597C8.17244 21.4693 8.27377 21.3176 8.34291 21.1507C8.41205 20.9838 8.44764 20.8049 8.44764 20.6242L8.44764 16.9281C8.44764 16.7475 8.41205 16.5686 8.34291 16.4016C8.27377 16.2347 8.17244 16.0831 8.04468 15.9553C7.91693 15.8276 7.76527 15.7262 7.59835 15.6571C7.43144 15.5879 7.25254 15.5524 7.07187 15.5524ZM18.0164 18.0164H19.5359V19.5359H18.0164V18.0164ZM20.4805 17.0719V20.4805H17.0719V17.0719H20.4805ZM20.6242 15.5524H16.9281C16.7475 15.5524 16.5686 15.5879 16.4016 15.6571C16.2347 15.7262 16.0831 15.8276 15.9553 15.9553C15.8276 16.0831 15.7262 16.2347 15.6571 16.4016C15.5879 16.5686 15.5524 16.7475 15.5524 16.9281V20.6242C15.5524 20.8049 15.5879 20.9838 15.6571 21.1507C15.7262 21.3176 15.8276 21.4693 15.9553 21.597C16.0831 21.7248 16.2347 21.8261 16.4016 21.8953C16.5686 21.9644 16.7475 22 16.9281 22H20.6242C20.9891 22 21.339 21.8551 21.597 21.597C21.8551 21.339 22 20.9891 22 20.6242V16.9281C22 16.7475 21.9644 16.5686 21.8953 16.4016C21.8261 16.2347 21.7248 16.0831 21.597 15.9553C21.4693 15.8276 21.3176 15.7262 21.1507 15.6571C20.9838 15.5879 20.8049 15.5524 20.6242 15.5524ZM18.0164 4.46407H19.5359V5.98357H18.0164V4.46407ZM20.4805 3.51951V6.92813L17.0719 6.92813V3.51951L20.4805 3.51951ZM20.6242 2L16.9281 2C16.7475 2 16.5686 2.03559 16.4016 2.10472C16.2347 2.17386 16.0831 2.2752 15.9553 2.40295C15.8276 2.53071 15.7262 2.68237 15.6571 2.84929C15.5879 3.0162 15.5524 3.1951 15.5524 3.37577V7.07187C15.5524 7.25254 15.5879 7.43144 15.6571 7.59835C15.7262 7.76527 15.8276 7.91693 15.9553 8.04469C16.0831 8.17244 16.2347 8.27378 16.4016 8.34291C16.5686 8.41205 16.7475 8.44764 16.9281 8.44764L20.6242 8.44764C20.8049 8.44764 20.9838 8.41205 21.1507 8.34291C21.3176 8.27378 21.4693 8.17244 21.597 8.04469C21.7248 7.91693 21.8261 7.76527 21.8953 7.59835C21.9644 7.43144 22 7.25254 22 7.07187V3.37577C22 3.01089 21.8551 2.66096 21.597 2.40295C21.339 2.14495 20.9891 2 20.6242 2ZM4.46407 4.46407H5.98357V5.98357H4.46407V4.46407ZM3.51951 6.92813L3.51951 3.51951L6.92813 3.51951L6.92813 6.92813L3.51951 6.92813ZM3.37577 8.44764H7.07187C7.25254 8.44764 7.43144 8.41205 7.59835 8.34291C7.76527 8.27378 7.91693 8.17244 8.04468 8.04469C8.17244 7.91693 8.27377 7.76527 8.34291 7.59835C8.41205 7.43144 8.44764 7.25254 8.44764 7.07187V3.37577C8.44764 3.1951 8.41205 3.0162 8.34291 2.84929C8.27377 2.68237 8.17244 2.53071 8.04468 2.40295C7.91693 2.2752 7.76527 2.17386 7.59835 2.10472C7.43144 2.03559 7.25254 2 7.07187 2L3.37577 2C3.01089 2 2.66096 2.14495 2.40295 2.40295C2.14495 2.66096 2 3.01089 2 3.37577L2 7.07187C2 7.25254 2.03559 7.43144 2.10472 7.59835C2.17386 7.76527 2.2752 7.91693 2.40295 8.04469C2.53071 8.17244 2.68237 8.27378 2.84929 8.34291C3.0162 8.41205 3.1951 8.44764 3.37577 8.44764ZM2 13.0883H3.51951L3.51951 14.6078H2L2 13.0883ZM10.9117 14.3203H9.3922V18.3039H10.6242V19.2485H9.3922L9.3922 20.768H11.8563V22H13.3758V20.768H14.6078V19.2485H13.0883V20.4805H12.1437V18.3039H14.6078V16.7844H10.9117V14.3203ZM20.768 9.3922L19.2485 9.3922V11.8563H17.0719V9.3922H13.3758L13.3758 6.92813L12.1437 6.92813V5.98357H13.3758V4.75154H14.6078V3.23203L13.3758 3.23203V2L9.3922 2V3.51951H11.8563V4.46407L10.6242 4.46407V7.21561H11.8563L11.8563 9.3922H10.6242V10.6242L8.44764 10.6242V9.3922H6.92813V10.6242H5.98357V9.3922H3.23203V10.6242H2L2 12.1437H3.51951L3.51951 10.9117H5.6961L5.6961 12.1437H6.92813L6.92813 14.6078H8.44764L8.44764 12.1437L10.9117 12.1437V10.9117H15.5524V11.8563H11.8563V13.3758H13.0883V15.8398H15.8398V14.3203H14.6078V13.3758H19.5359V12.1437H20.4805V13.3758H22V11.8563H20.768V9.3922Z" fill="#454545" />
            </svg>
            <span className={styles.span}>加群</span>
          </div>
          {
            isShowQrcode === 'show' ? <div className={styles['hover-img-view']}>
              <img className={styles['img']} src="https://tiwen.redtom.com/static/imgs/index/qrcode.png" alt="加群二维码" />
              <svg className={styles['hover-img-svg']} width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.62932 7.45719C9.59923 8.25716 9.59923 9.74304 8.62932 10.543L1.96571e-07 17.6604L9.53674e-07 0.339843L8.62932 7.45719Z" fill="white" />
              </svg>
            </div> : ''
          }
          {isShowToTop ? <div className={styles['btn-top']} onClick={scrollToTop}>
            <svg className={styles.svg} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.54986 12.528L10.6339 9.162C11.1499 8.478 12.1099 8.346 12.7939 8.85C12.9139 8.934 13.0099 9.042 13.1059 9.162L16.1899 12.528C16.7059 13.212 16.5619 14.172 15.8779 14.688C15.6139 14.892 15.2899 15 14.9539 15L8.78586 15C7.93386 15 7.23786 14.304 7.23786 13.452C7.23786 13.128 7.34586 12.804 7.54986 12.528Z" fill="#454545" />
            </svg>
            <span className={styles.span}>顶部</span>
          </div> : '' }
        </section>
      </main>
    </Layout>
  );
}
