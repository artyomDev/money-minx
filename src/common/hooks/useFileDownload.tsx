import domToImage from 'dom-to-image';
import fileDownload from 'js-file-download';

const useFileDownload = () => {
  return {
    df: (id: string, name: string) => {
      const domNode = document.getElementById(id) as any;
      const scale = 3;
      domToImage
        .toBlob(domNode, {
          width: domNode.clientWidth * scale,
          height: domNode.clientHeight * scale,
          style: {
            transform: 'scale(' + scale + ')',
            transformOrigin: 'top left',
          },
        })
        .then((blob) => {
          fileDownload(blob, name + '.png');
        });
    },

    getImage: async (id: string): Promise<{ image: any; error: any }> => {
      return new Promise((resolve, reject) => {
        const node = document.getElementById(id) as any;
        const scale = 3;

        domToImage
          .toBlob(node, {
            width: node.clientWidth * scale,
            height: node.clientHeight * scale,
            style: {
              transform: 'scale(' + scale + ')',
              transformOrigin: 'top left',
            },
          })
          .then((blob) => {
            if (blob) {
              resolve({
                image: blob,
                error: null,
              });
            } else {
              resolve({
                image: null,
                error: 'not found',
              });
            }
          })
          .catch((err) => {
            reject({
              image: null,
              error: `${err}`,
            });
          });
      });
    },
  };
};

export default useFileDownload;
