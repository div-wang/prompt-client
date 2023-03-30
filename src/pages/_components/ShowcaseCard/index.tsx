/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import copy from "copy-text-to-clipboard";
import Image from "@theme/IdealImage";
import FavoriteIcon from "@site/src/components/svgIcons/FavoriteIcon";
import {
  Tags,
  TagList,
  type TagType,
  type User,
  type Tag,
} from "@site/src/data/users";
import { sortBy } from "@site/src/utils/jsUtils";
import Heading from "@theme/Heading";
import Tooltip from "../ShowcaseTooltip";
import styles from "./styles.module.css";

const TagComp = React.forwardRef<HTMLLIElement, Tag>(
  ({ label, color, description }, ref) => (
    <li ref={ref} className={styles.tag} title={description}>
      <span className={styles.textLabel}>{label.toLowerCase()}</span>
      <span className={styles.colorLabel} style={{ backgroundColor: color }} />
    </li>
  )
);

function ShowcaseCardTag({ tags }: { tags: TagType[] }) {
  const tagObjects = tags.map((tag) => ({ tag, ...Tags[tag] }));

  // Keep same order for all tags
  const tagObjectsSorted = sortBy(tagObjects, (tagObject) =>
    TagList.indexOf(tagObject.tag)
  );

  return (
    <>
      {tagObjectsSorted.map((tagObject, index) => {
        const id = `showcase_card_tag_${tagObject.tag}`;

        return (
          <Tooltip
            key={index}
            text={tagObject.description}
            anchorEl="#__docusaurus"
            id={id}
          >
            <TagComp key={index} {...tagObject} />
          </Tooltip>
        );
      })}
    </>
  );
}

function getCardImage(user: User): string {
  return (
    user.preview ??
    `https://slorber-api-screenshot.netlify.app/${encodeURIComponent(
      user.website
    )}/showcase`
  );
}

function ShowcaseCard({ user }: { user: User }) {
  const image = getCardImage(user);
  // 复制
  const [copied, setShowCopied] = useState(true);
  const handleCopyCode = () => {
    if (user.description) {
      copy(user.description);
    }
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };
  // 点击显示中文文本
  const [paragraphText, setParagraphText] = useState(user.description);
  function handleParagraphClick() {
    if (paragraphText === user.description) {
      setParagraphText(user.descn);
    } else {
      setParagraphText(user.description);
    }
  }
  return (
    <li key={user.title} className={clsx("card", styles.showcaseCardCenter)}>
      <div className="card__body">
        <div className={clsx(styles.showcaseCardHeader)}>
          <Heading as="div" className={styles.showcaseCardTitle}>
            <div className={styles.showcaseCardTitlebcg}>
              <Link href={user.website} className={styles.showcaseCardLink}>
                {user.title}
              </Link>
            </div>
          </Heading>

          <button
            className={styles.showcaseCardSrcBtn}
            type="button"
            onClick={handleCopyCode}
          >
            去提问
          </button>
        </div>
        <p className={styles.showcaseCardBody}>👉 {user.remark}</p>
        <p onClick={handleParagraphClick} className={styles.showcaseCardBody}>
          {paragraphText}
        </p>
      </div>
      <ul className={clsx("card__footer", styles.cardFooter)}>
        <ShowcaseCardTag tags={user.tags} />
      </ul>
    </li>
  );
}
export default React.memo(ShowcaseCard);
