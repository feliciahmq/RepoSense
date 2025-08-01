{% set title = "Appendix: Config files format" %}
<frontmatter>
  title: "{{ title | safe }}"
  pageNav: 3
</frontmatter>

{% set mandatory %}<span class="badge bg-danger">mandatory</span>{% endset %}

{% from 'scripts/macros.njk' import embed with context %}

<h1 class="display-4"><md>{{ title }}</md></h1>

<div class="lead">

Given below are the details of the various config files used by RepoSense.
</div>

<box type="info" seamless>

**RepoSense ignores the order of column headers in the CSV config files. However, the spelling of the column headers must match the specified headers exactly, or the column would be ignored by RepoSense.**
</box>

<box type="info" seamless>

**A value in a config file is optional to provide unless it is specified as {{ mandatory }}**.
</box>
<!-- ==================================================================================================== -->

## `repo-config.csv`

**`repo-config.csv` file contains repo-level config data.** Each row represents a repository's configuration ([example](repo-config.csv)).


| Column Name                           | Explanation                                                                                                                                                                                                                                                                                                                                                                                                                        |
|---------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Repository's Location {{ mandatory }} | The `Remote Repo URL` or `Disk Path` to the Git repository e.g., `https://github.com/foo/bar.git` or `C:\Users\user\Desktop\GitHub\foo\bar`                                                                                                                                                                                                                                                                                        |
| Branch                                | The branch to analyze in the target repository e.g., `master`. Default: the default branch of the repo                                                                                                                                                                                                                                                                                                                             |
| File formats<sup>*+</sup>             | The file extensions to analyze. Binary file formats, such as `png` and `jpg`, will be automatically labelled as the file type `binary` in the generated report. Default: all file formats                                                                                                                                                                                                                                          |
| Find Previous Authors                 | Enter **`yes`** to utilize Git blame's ignore revisions functionality, RepoSense will attempt to blame the line changes caused by commits in the ignore commit list to the previous authors who altered those lines (if available).                                                                                                                                                                                                |
| Ignore Glob List<sup>*+</sup>         | The list of file path globs to ignore during analysis for each author e.g., `test/**;temp/**`. Refer to the [_glob format_](https://docs.oracle.com/javase/tutorial/essential/io/fileOps.html#glob) for the path glob syntax.                                                                                                                                                                                                      |
| Ignore standalone config              | To ignore the standalone config file (if any) in target repository, enter **`yes`**. If the cell is empty, the standalone config file in the repo (if any) will take precedence over configurations provided in the csv files.                                                                                                                                                                                                     |
| Ignore Commits List<sup>*+</sup>      | The list of commits to ignore during analysis. For accurate results, the commits should be provided with their full hash. Additionally, a range of commits can be specified using the `..` notation e.g. `abc123..def456` (both inclusive).                                                                                                                                                                                        |
| Ignore Authors List<sup>*+</sup>      | The list of authors to ignore during analysis. Authors should be specified by their [Git Author Name](#a-note-about-git-author-name).                                                                                                                                                                                                                                                                                              |
| Shallow Cloning                       | Enter **`yes`** to clone the repository using Git's shallow cloning functionality. This option can significantly reduce the time taken to clone large repositories. However, the option should ideally be disabled for smaller repositories where the `.git` file is smaller than 500 MB, as it would create overhead.                                                                                                             |
| File Size Limit<sup>+</sup>           | Enter a file size limit for the repository in bytes as a single number without units (for a size limit of 1MB for example, enter 1000000). This file size limit will override the default file size limit (500KB). Files exceeding the file size limit will be marked as ignored and only the file name and line count will be reflected in the report.                                                                            |
| Ignore File Size Limit                | Enter **`yes`** to ignore both the default file size limit and the file size limit possibly set by the user in `repo-config.csv`.                                                                                                                                                                                                                                                                                                  |
| Skip Ignored File Analysis            | Enter **`yes`** to ignore analysis of files exceeding the file size limit entirely. If file analysis is skipped, all information about the file will be omitted from the generated report. This option can significantly improve report generation time.                                                                                                                                                                           |
| Since Date                            | Enter since date (with optional time specification) in one of the following formats: <br>• `DD/MM/YYYY`<br>• `DD/MM/YYYY'T'HH:mm`<br>• `DD/MM/YYYY'T'HH:mm:ss`<br><br> This signifies the start date of analysis. If the field is ignored, the date will be set to the default one or the date indicated in CLI flags <br><br> If hours/ minutes/ seconds are not provided, each will default to `00`                              |
| Until Date                            | Enter until date (with optional time specification) in one of the following formats: <br>• `DD/MM/YYYY`<br>• `DD/MM/YYYY'T'HH:mm`<br>• `DD/MM/YYYY'T'HH:mm:ss`<br><br> This signifies the end date of analysis. If the field is ignored, the date will be set to the default one or the date indicated in CLI flags <br><br> If hours/ minutes/ seconds are not provided, they will default to `23`, `59`, and `59`, respectively. |

<box type="info" seamless>
The Shallow Cloning option is incompatible with the "--last-modified-date" CLI flag.
</box>

<box type="info" seamless>
Behavior of since dates and until dates specified in CSV and CLI flags:

1. *Both CSV Dates and CLI Flags Are Provided*
   
   **Behavior**:

   When both the CSV file and the CLI include values for the “since” and “until” dates, the commit range for an individual repository is taken directly from its CSV dates.

   **Validation**:

   The CSV “since” and “until” dates must fall within the boundaries defined by the CLI flags. If the CSV date range extends before the CLI “since” date or beyond the CLI “until” date, that repository’s data will be considered invalid and will not be processed. An error message will be displayed.

   **Example**:

   CLI Dates: Since: 21/09/2024T12:30:00; Until: 29/01/2025T17:50:59

   CSV Date Ranges:

   Invalid: [01/02/2025T14:00:00, 02/02/2025T14:00:00] (exceeds the CLI "until" date), [01/09/2024T13:00:00, 01/01/2025T13:00:00] (starts before the CLI "since" date)

   Valid: [30/09/2024T16:30:00, 01/01/2025T16:30:00]

2. CSV Dates Are Fully Provided, but One CLI Flag Is Missing
   
   **Behavior**:
   
   The range of commits retrieved for the repo is fully determined by the dates specified in the CSV file.

   **UI Adjustment**:

   In the user interface, the adjustable date range will automatically span from the earliest “since” date to the latest “until” date across all repositories with valid CSV dates.

3. Both CSV Dates Are Absent
   
   **Behavior**:
   
   When no dates are provided in the CSV file, the commit range is based on the CLI flags. If the CLI flags are not provided either, then the tool falls back on the predefined default date values.

4. One CSV Date Is Missing 

   **Behavior**:
   
   If either the “since” or “until” date is omitted in the CSV file, the missing value will be replaced by a default value (i.e. the commits within the most recent one month), or the corresponding value from the CLI flag (if specified).
</box>

<box type="info" seamless>
If Ignore File Size Limit is yes, the File Size Limit and Skip Ignored File Analysis columns are ignored.
</box>

<sup>* **Multi-value column**: multiple values can be entered in this column using a semicolon `;` as the separator.</sup></br>
<sup>+ **Overrideable column**: prepend with `override:` to use entered value(s) instead of value(s) from standalone config.</sup>

<box type="info" seamless>

When using [standalone config](#config-json-standalone-config-file) (if it is not ignored), it is possible to override specific values from the standalone config by prepending the entered value with `override:`.

The `default` sort option in the frontend sorts the repos by the order of rows in `repo-config.csv`.
</box>

<!-- ==================================================================================================== -->

## `author-config.csv`

Optionally, you can use an `author-config.csv` (which should be in the same directory as the `repo-config.csv` file) to provide more details about the authors to analyze ([example](author-config.csv)). It should contain the following columns:

| Column Name                                      | Explanation                                                                                                                                                                                      |
|--------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Repository's Location<sup>*</sup>                | Same as `repo-config.csv`. Default: all the repos in `repo-config.csv`.                                                                                                                          |
| Branch                                           | The branch to analyze for this author, e.g., `master`. Default: the author will be bound to all the repos in `repo-config.csv` that has the same repo's location, regardless of branch.          |
| Author's Git Host ID<sup>#</sup> {{ mandatory }} | Username of the target author's profile on GitHub, GitLab or Bitbucket, e.g.`JohnDoe`.                                                                                                           |
| Author's Emails<sup>*</sup>                      | Associated emails of the author. For GitHub users, this can be found in your [GitHub settings](https://github.com/settings/emails).                                                              |
| Author's Display Name                            | The name to display for the author. Default: author's username.                                                                                                                                  |
| Author's Git Author Name<sup>*</sup>             | The meaning of _Git Author Name_ is explained in [_A note about Git author name_](#a-note-about-git-author-name).                                                                                |
| Ignore Glob List<sup>*</sup>                     | Files to ignore for this author, in addition to files ignored by the patterns specified in `repo-config.csv`. The path glob syntax is the same as that of Ignore Glob List in `repo-config.csv`. |

<sup>* **Multi-value column**: multiple values can be entered in this column using a semicolon `;` as the separator.</sup>
</br>
<sup># For backward compatibility, `Author's GitHub ID` is still accepted as the header in place of `Author's Git Host ID`.</sup>

If `author-config.csv` is not given and the repo has not provided author details in a standalone config file, all the authors of the repositories within the date range specified (if any) will be analyzed.

`author-config.csv` has some advanced syntax that can help to reduce duplication of the author's information. The syntax guide is given below:

{{ embed("Appendix: `author-config.csv` advanced syntax", "authorConfigSyntax.md") }}

<!-- ==================================================================================================== -->

## `group-config.csv`

Optionally, you can provide a `group-config.csv`(which should be in the same directory as `repo-config.csv` file) to provide details on any custom groupings for files in specified repositories ([example](group-config.csv)). It should contain the following columns:

| Column Name                | Explanation                                                                           |
|----------------------------|---------------------------------------------------------------------------------------|
| Repository's Location      | Same as `repo-config.csv`. Default: all the repos in `repo-config.csv`                |
| Group Name {{ mandatory }} | Name of the group, e.g.,`test`.                                                       |
| Globs * {{ mandatory }}    | The list of file path globs to include for specified group, e.g.,`**/test/*;**.java`. |

<sup>* **Multi-value column**: multiple values can be entered in this column using a semicolon `;` as the separator.</sup>

Note that a file in a given repository should only be tagged to one group. <br>
e.g.: `example.java` in `example-repo` can either be in the `test` group or the `code` group, but not in both `test` and `code` group. If multiple groups are specified for a given file, the latter group (i.e., `code` group) is set for the file.

<!-- ==================================================================================================== -->

## `report-config.yaml`

You can also optionally use a `report-config.yaml` file to quickly define the repository information for the repositories you are interested in tracking and generating your very own code portfolio.
The configurations of this file will override the CSV files if the `repos` field of the file is present and correctly formatted.

Please refer to this [guide](./reportConfig.html#advanced-report-configuration).

<!-- ==================================================================================================== -->

<div id="section-standalone">

## `config.json` (standalone config file)

Repo owners can provide the following additional information to RepoSense using a config file that we call the **_standalone config file_**:
* which files/authors/commits to analyze/omit
* which Git and Git host usernames belong to which authors
* the display of an author

To use this feature, add a `_reposense/config.json` to the root of your repo using the format in the example below ([another example](https://github.com/reposense/RepoSense/blob/master/_reposense/config.json)) and **commit it** (reason: RepoSense can see committed code only):
```json {.no-line-numbers}
{
  "ignoreGlobList": ["about-us/**", "**index.html"],
  "formats": ["html", "css"],
  "ignoreCommitList": ["90018e49f129ce7e0abdc8b18e91c9813588c601", "67890def", "abc123..def456"],
  "ignoreAuthorList": ["charlie"],
  "authors":
  [
    {
      "gitId": "alice",
      "emails": ["alice@example.com", "alicet@example.com"],
      "displayName": "Alice T.",
      "authorNames": ["AT", "A"],
      "ignoreGlobList": ["**.css"]
    },
    {
      "gitId": "bob"
    }
  ]
}
```
Note: all fields are optional unless specified otherwise.

**Fields to provide _repository-level_ info**:

* `ignoreGlobList`: Folders/files to ignore, specified using the [_glob format_](https://docs.oracle.com/javase/tutorial/essential/io/fileOps.html#glob).
* `formats`: File formats to analyze. Binary file formats, such as `png` and `jpg`, will be automatically labelled as the file type `binary` in the generated report. Default: all file formats
* `ignoreCommitList`: The list of commits to ignore during analysis. For accurate results, the commits should be provided with their full hash. Additionally, a range of commits can be specified using the `..` notation e.g. `abc123..def456` (both inclusive).
* `ignoreAuthorList`: The list of authors to ignore during analysis. Authors specified in `authors` field or `author-config.csv` will be also be omitted if they are in this list. Authors should be specified by their [Git Author Name](#a-note-about-git-author-name).
* `fileSizeLimit`: A file size limit for the repository in bytes as a single number without units, that will override the default file size limit. If not specified, the default file size limit will continue to be used.

**Fields to provide _author-level_ info**:<br>
Note: `authors` field should contain _all_ authors that should be captured in the analysis.
* `gitId`: Username of the author. {{ mandatory }} field.
* `emails`: Associated Git emails of the author. For GitHub, this can be found in your [GitHub settings](https://github.com/settings/emails).
* `displayName`: Name to display on the report for this author.
* `authorNames`: Git Author Name(s) used in the author's commits. By default, RepoSense assumes an author would use their remote Git Host username as the Git username too. The meaning of _Git Author Name_ is explained in [_A note about Git author name_](#a-note-about-git-author-name).
* `ignoreGlobList`: _Additional_ (i.e. on top of the repo-level `ignoreGlobList`) folders/files to ignore for a specific author. The path glob syntax is specified by the [_glob format_](https://docs.oracle.com/javase/tutorial/essential/io/fileOps.html#glob). In the example above, the actual `ignoreGlobList` for `alice` would be `["about-us/**", "**index.html", "**.css"]`.

To verify your standalone configuration is as intended, add the `_reposense/config.json` to your local copy of repo and run RepoSense against it as follows:<br>
* Format: `java -jar RepoSense.jar --repo LOCAL_REPO_LOCATION` <br>
* Example: `java -jar RepoSense.jar --repo c:/myRepose/foo/bar`<br>
After that, view the report to see if the configuration you specified in the config file is being reflected correctly in the report.

## A note about Git author name

`Git Author Name` refers to the customizable author's display name set in the local `.gitconfig` file. For example, in the Git Log's display:
``` {.no-line-numbers}
...
commit cd7f610e0becbdf331d5231887d8010a689f87c7
Author: ConfiguredAuthorName <author@example.com>
Date:   Fri Feb 9 19:14:41 2018 +0800

    Make some changes to show my new author's name

commit e3f699fd4ef128eebce98d5b4e5b3bb06a512f49
Author: ActualGitHostId <author@example.com>
Date:   Fri Feb 9 19:13:13 2018 +0800

    Initial commit
 ...
```
`ActualGitHostId` and `ConfiguredAuthorName` are both `Git Author Name` of the same author.<br>
To find the author name that you are currently using for your current Git repository, run the following command within your Git repository:
``` shell {.no-line-numbers}
git config user.name
```
To set the author name to the value you want (e.g., to set it to your GitHub username) for your current Git repository, you can use the following command ([more info](https://www.git-tower.com/learn/git/faq/change-author-name-email)):
``` shell {.no-line-numbers}
git config user.name "YOUR_AUTHOR_NAME”
```
To set the author name to use a default value you want for future Git repositories, you can use the following command:
``` shell {.no-line-numbers}
git config --global user.name "YOUR_AUTHOR_NAME”
```
RepoSense expects the Git Author Name to be the same as author's username on the Git hosting platform (GitHub, GitLab, BitBucket). If an author's `Git Author Name` is different from their username on the Git hosting platform, the `Git Author Name` needs to be specified in the standalone config file. If the author has more than one `Git Author Name`, multiple values can be entered too.

<box type="warning" seamless>

Note: Symbols such as `"`, `!`, `/` etc. in your author name will be omitted, which may reduce the accuracy of the analysis if 2 names in the repository are approximately similar.
</box>

</div>

<!-- ==================================================================================================== -->

<div id="section-blurbs">

## Blurbs Markdown files
You can optionally use blurbs markdown files to add blurbs in Markdown syntax for repository branches or authors.

### `repo-blurbs.md`
<div id="section-repo-blurbs">

This file allows you to specify blurbs for repository branches. These blurbs will be displayed when grouping by `Repo/Branch`.

**Format**:
* First line in section: Link to the repository branch.
* Second line onwards: Blurb content.
* Delimiter: `<!--repo-->`. Everything on the line after the delimiter will be ignored.
* Sample: [repo-blurbs.md](https://github.com/reposense/RepoSense/blob/master/docs/ug/repo-blurbs.md)
</div>

### `author-blurbs.md`
<div id="section-author-blurbs">

This file allows you to specify blurbs for authors. These blurbs will be displayed when grouping by `Author`.

**Format**:
* First line in section: Author's Git Host ID.
* Second line onwards: Blurb content.
* Delimiter: `<!--author-->`. Everything on the line after the delimiter will be ignored.
* Sample: [author-blurbs.md](https://github.com/reposense/RepoSense/blob/master/docs/ug/author-blurbs.md)
</div>

### `chart-blurbs.md`
<div id="section-chart-blurbs">

This file allow you to specify blurbs for specific charts. These blurbs will be displayed with the charts.

**Format**:
* First line in section: Link to the repository branch|Author's Git Host ID. (Note the `|` between repository's link and author's Git Host ID)
* Second line onwards: Blurb content.
* Delimiter: `<!--chart-->`. Everything on the line after the delimiter will be ignored.
* Sample: [chart-blurbs.md](https://github.com/reposense/RepoSense/blob/master/docs/ug/chart-blurbs.md))
</div>
