# Homepage of Dr. Cheems Wang

The source of Dr. Cheems Wang's academic homepage, published free with GitHub Pages.
It is a plain HTML site: no build step, no software to install, and everything can be done in the browser.

In this guide, replace `USERNAME` with your GitHub username (for example `cheemswang`).

## What is in this folder

| File | What it is |
| --- | --- |
| `index.html` | All the text on the page. **The only file you normally edit.** |
| `style.css` | Layout, colours and fonts (light and dark mode). |
| `main.js` | The visitor counter, the "Show all news" button, section highlighting and the interactive uncertainty plot. |
| `404.html` | The "page not found" page. |
| `blogs/` | Blog posts, one HTML page each. `example-post.html` is a placeholder to copy for new posts. |
| `images/` | The site icon, and in `images/pubs` the first-page pictures shown beside the Selected papers. Add your portrait here as `profile.jpg`. |
| `fonts/` | The Literata typeface, stored with the site so the page loads quickly in mainland China too (no Google Fonts). |

---

## Step 1. Create a GitHub account (skip if you have one)

1. Go to <https://github.com/signup>.
2. Enter your email, a password and a **username**. The username becomes your web address: `cheemswang` gives `https://cheemswang.github.io`. Choose something short and professional, because changing it later changes the address.
3. Verify your email with the code GitHub sends. If GitHub asks you to set up two-factor authentication, follow its prompts. The free plan is all you need.

## Step 2. Create the website repository

1. Signed in to GitHub, click **+** at the top right, then **New repository**.
2. For **Repository name**, type exactly `USERNAME.github.io`, in lowercase, with your own username (for example `cheemswang.github.io`).
3. Choose **Public**. Free accounts can only publish sites from public repositories.
4. Leave "Add README" off (this folder already has one) and click **Create repository**.

## Step 3. Add the photo, then upload the files

1. Unzip `cheems-wang-homepage.zip`.
2. Put the portrait in the `images` folder and name it exactly `profile.jpg`. A portrait-shaped photo works best (for example 800 × 1000 pixels, under 500 KB). Until you add it, the page shows the initials "CW".
3. On the new repository page, click the link **uploading an existing file** (or **Add file → Upload files**).
4. Open the unzipped folder, select **everything inside it** (`index.html`, `style.css`, `main.js`, `404.html`, `README.md` and the `blogs`, `fonts` and `images` folders) and drag it onto the upload area.
   Drag the contents, not the outer folder: `index.html` must be at the top level of the repository.
5. When all files are listed, click **Commit changes**.

**Check:** the repository's file list shows `index.html` at the top level, next to the `blogs`, `fonts` and `images` folders.

## Step 4. Turn on GitHub Pages

1. In the repository, click **Settings**, then **Pages** in the left sidebar.
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Under **Branch**, choose `main` and `/ (root)`, then click **Save**.
4. Wait one or two minutes and refresh. The Pages settings show **Your site is live at https://USERNAME.github.io**. Open it.

Progress appears in the repository's **Actions** tab as "pages build and deployment". A green tick means the site is published.

## Step 5. Turn on the visitor counter

The number appears at the bottom of the page and stays hidden until it has something to show.

### Option A: GoatCounter (recommended)

GoatCounter is free for personal, non-commercial sites, sets no cookies, and gives you a dashboard of visitors, referrers and countries.

1. Go to <https://www.goatcounter.com> and click **Sign up**. Choose a **code**, for example `cheemswang`; your dashboard will be at `https://cheemswang.goatcounter.com`.
2. In the GoatCounter dashboard, open **Settings**, tick **Allow adding visitor counts on your website**, and save. Without this, the site can record visits but cannot show the number.
3. In your GitHub repository, click `index.html`, then the **pencil icon** (Edit this file). Search for `id="visits"` (Ctrl+F or Cmd+F) to find this line:

   ```html
   <p class="visits" id="visits" data-provider="goatcounter" data-code="" hidden>
   ```

   Type your code between the empty quotes after `data-code`:

   ```html
   <p class="visits" id="visits" data-provider="goatcounter" data-code="cheemswang" hidden>
   ```

4. Click **Commit changes…**, then **Commit changes**. The site updates within a minute or two.
5. Visit the site. GoatCounter refreshes the public number about every 30 minutes, so the first count can take a while to appear.

To stop counting your own visits, open `https://USERNAME.github.io/#toggle-goatcounter` once in each browser you use. Opening it again turns counting back on.

### Option B: Busuanzi 不蒜子 (no sign-up)

On the same line, change `data-provider="goatcounter"` to `data-provider="busuanzi"` and commit. Counting starts from zero and there is no dashboard. Busuanzi is a free hobby service and is occasionally down; the counter simply hides while it is.

The text after the number reads "visitors since September 2026". If you launch in another month, change it on the next line of `index.html`.

## Step 6. Update the site later

Everything is in `index.html`. Open it on GitHub, click the pencil icon, edit, then **Commit changes**. The live site updates in about a minute; if you still see the old version, force-refresh (Ctrl+F5, or Cmd+Shift+R on a Mac).

**Add a news item.** News is newest first. Copy an existing item, paste it at the top of the list and change it:

```html
<li>
  <time class="when" datetime="2026-10-15">15 Oct 2026</time>
  <p>“<a href="https://arxiv.org/abs/XXXX.XXXXX">Paper title</a>” was accepted to ICLR 2027. Congratulations to …!</p>
</li>
```

The page shows the first 8 items and hides the rest behind a **Show all** button. To show more or fewer, change `data-show="8"` on the news list.

**Add a publication.** The list mirrors the Google Scholar profile, newest year first. Copy an existing paper, paste it into the right year and change it. Write his name as `<b>Cheems Wang</b>`:

```html
<li class="pub">
  <span class="when venue">ICLR</span>
  <div>
    <a class="pub-title" href="https://arxiv.org/abs/XXXX.XXXXX">Paper title</a>
    <p class="authors">A. Author, <b>Cheems Wang</b>*, B. Author</p>
    <p class="pub-links"><a href="https://github.com/…">Code</a></p>
  </div>
</li>
```

- For an oral or spotlight, put `<span class="vnote">Oral</span>` right after the venue name.
- **Selected** is the view visitors see first. To highlight a paper and include it under **Selected**, change `class="pub"` to `class="pub is-selected"` and put `<span class="pick">Selected</span>` after the venue name.
- For a new year, copy a whole `<div class="pub-year-group">` block, change its year and replace the papers in it.
- The "All" and "Selected" counts update by themselves. The citation numbers in the note above the list do not; update them from Google Scholar now and then.

**Add a picture beside a paper.** Each Selected paper shows its first page (the thesis shows its cover) next to the title; clicking the picture opens the paper. Any paper can have one.

1. Open the paper's PDF, zoom until the whole first page fits on screen and take a screenshot of it (Windows: Win+Shift+S; Mac: Cmd+Shift+4). Save it as PNG or JPG. A width of 240 to 480 pixels is plenty.
2. On GitHub, open the `images/pubs` folder, choose **Add file → Upload files** and upload the picture. Give it a short name without spaces, such as `new-paper.png`.
3. In `index.html`, paste this line directly below the paper's venue line (`<span class="when venue">…</span>`), then change the link to the one the title uses and the file name to yours:

```html
<a class="pub-thumb" href="https://arxiv.org/abs/XXXX.XXXXX" tabindex="-1" aria-hidden="true"><img src="images/pubs/new-paper.png" alt="" width="240" height="311" loading="lazy" decoding="async"></a>
```

`width` and `height` only reserve space while the picture loads, so keep 240 and 311 for an ordinary paper page. To remove a picture, delete its line.

**Add a blog post.** Each post is its own HTML page in the `blogs` folder.

1. Open `blogs/example-post.html` on GitHub and copy its contents (the copy icon at the top right of the file view).
2. In the `blogs` folder, choose **Add file → Create new file**, name it something short without spaces, such as `mpts-explained.html`, paste, and change the title, date and text. Images go in the `images` folder and are linked as `../images/name.png`.
3. In `index.html`, search for `id="blog-list"` and add an entry at the top of the list:

```html
<li>
  <time class="when" datetime="2026-11">Nov 2026</time>
  <div>
    <a class="post-title" href="blogs/mpts-explained.html">Post title</a>
    <p class="post-summary">One or two sentences about the post.</p>
  </div>
</li>
```

Remove the placeholder entry (and `blogs/example-post.html`, if you like) once the first real post is up. The page shows the 5 newest posts and hides the rest behind a **Show all** button; change `data-show="5"` to show more.

**Add a student:**

```html
<li><span class="name">Name</span> <span class="years">2026–</span> <span class="note" lang="zh-CN">备注</span></li>
```

**Change the photo:** open the `images` folder on GitHub, choose **Add file → Upload files**, and upload a new `profile.jpg`. A file with the same name replaces the old one.

**Remove the uncertainty plot:** delete the block that starts with `<figure class="posterior" id="posterior">` and ends with `</figure>`.

## Step 7. Help people find the page (optional)

- Put the address in the **Homepage** field of your Google Scholar and OpenReview profiles, and in your X and Zhihu bios.
- Link it from the THU-IDM team page and your email signature.
- To use your own domain name, see GitHub's guide [Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## If something goes wrong

- **"There isn't a GitHub Pages site here" (404).** Wait two minutes and refresh. Check that the repository is named exactly `USERNAME.github.io`, that `index.html` is at the top level, and that step 4 is saved.
- **The page has no styling or the wrong font.** `style.css` or the `fonts` folder is missing or ended up inside a subfolder. Upload it again at the top level, then force-refresh.
- **The `blogs`, `fonts` or `images` folder did not upload.** Use Chrome or Edge, open **Add file → Upload files** and drag the folder itself onto the upload area.
- **The visitor counter does not appear.** Check that `data-code` matches your GoatCounter code exactly and that "Allow adding visitor counts on your website" is ticked, then allow up to 30 minutes. Visitors with ad blockers are not counted and do not see the number.
- **Previewing on your own computer.** Double-clicking `index.html` opens the page, but the counter only works once the site is online, and some browsers show a fallback font for local files.

## Using git instead of the browser (optional)

```bash
git clone https://github.com/USERNAME/USERNAME.github.io.git
cd USERNAME.github.io
# copy the site files into this folder, then:
git add .
git commit -m "Update homepage"
git push
```

## Credits

The Literata typeface is by TypeTogether for Google and is used under the SIL Open Font License (`fonts/OFL.txt`).
