import JSZip from 'jszip';
import { Repo, User } from './types';
import { AuthorshipSchema } from './zod/authorship-type';
import { AuthorDailyContributions } from './zod/commits-type';
import { DomainUrlMap, ErrorMessage } from './zod/summary-type';

// Declares the types for all the global variables under the window object
export {};

interface ComparatorFunction<T> {
  (a: T, b: T): -1 | 0 | 1;
}

type ComparablePrimitive = string | number;

interface SortingFunction<T> {
  (item: T, sortingOption?: string): ComparablePrimitive;
}

interface Api {
  loadJSON: (fname: string) => Promise<unknown>;
  loadSummary: () => Promise<{
    creationDate: string,
    reportGenerationTime: string,
    errorMessages: { [key: string]: ErrorMessage },
    names: string[],
    repoBlurbMap: { [key: string]: string },
    authorBlurbMap: {[key: string]: string} | undefined,
    chartBlurbMap: {[key: string]: string} | undefined,
  } | null>;
  loadCommits: (repoName: string, defaultSortOrder: number) => Promise<User[]>;
  loadAuthorship: (repoName: string) => Promise<AuthorshipSchema>;
  setContributionOfCommitResultsAndInsertRepoId: (dailyCommits: AuthorDailyContributions[], repoId: string) => void;
}

declare global {
  interface Window {
    $: (id: string) => HTMLElement | null;
    enquery: (key: string, val: string) => string;
    REPOSENSE_REPO_URL: string;
    HOME_PAGE_URL: string;
    UNSUPPORTED_INDICATOR: string;
    DAY_IN_MS: number;
    HASH_DELIMITER: string;
    REPOS: { [key: string]: Repo };
    LOGO_PATH: string;
    hashParams: { [key: string]: string };
    isMacintosh: boolean;
    REPORT_ZIP: JSZip | null;
    deactivateAllOverlays: () => void;
    getDateStr: (date: number) => string;
    getHexToRGB: (color: string) => number[];
    getFontColor: (color: string) => string;
    addHash: (newKey: string, newVal: string | boolean) => void;
    removeHash: (key: string) => void;
    encodeHash: () => void;
    decodeHash: () => void;
    comparator: <T> (fn: SortingFunction<T>, isDesc?: boolean, sortingOption?: string) => ComparatorFunction<T>;
    filterUnsupported: (string: string) => string | undefined;
    getAuthorLink: (repoId: string, author: string) => string | undefined;
    getRepoLinkUnfiltered: (repoId: string) => string;
    getRepoLink: (repoId: string) => string | undefined;
    getBranchLink: (repoId: string, branch: string) => string | undefined;
    getCommitLink: (repoId: string, commitHash: string) => string | undefined;
    getBlameLink: (repoId: string, branch: string, filepath: string) => string | undefined;
    getHistoryLink: (repoId: string, branch: string, filepath: string) => string | undefined;
    getGroupName: (group: User[], filterGroupSelection: string) => string;
    getAuthorDisplayName: (authorRepos: User[]) => string;
    api: Api;
    sinceDate: string;
    untilDate: string;
    repoSenseVersion: string;
    isSinceDateProvided: boolean;
    isUntilDateProvided: boolean;
    isAuthorshipAnalyzed: boolean;
    isPortfolio: boolean;
    DOMAIN_URL_MAP: DomainUrlMap;
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    app: any;
  }
}
