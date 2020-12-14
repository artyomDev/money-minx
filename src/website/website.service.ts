import axios from 'axios';

export const fetchBlogs = async (postCategory: number = 5) => {
  const url = `https://www.moneyminx.com/blog/wp-json/wp/v2/posts?per_page=3&categories=${postCategory}&order=desc`;
  const res = await axios.get(url);

  return res;
};
