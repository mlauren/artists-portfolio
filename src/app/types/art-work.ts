export class ArtWork {
    _createdAt: Date;
    _id: string;
    _rev: string;
    _updatedAt: Date;
    album: { _ref: string, _type: string };
    category: { _ref: string, _type: string };
    description: Array<{_key: string, _type: string, children: Array<{marks:  Array<{}>, text: string }>, markDefs: Array<{_key: string, _type: string, href: string, style: string}>}>;
    name: string;
    slug: {_type: string, curent: string};
}
