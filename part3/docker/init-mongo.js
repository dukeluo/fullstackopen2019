db.createUser(
    {
        user: 'stack',
        pwd: 'stack',
        roles: [
            {
                role: 'readWrite',
                db: 'fullstackopen2019',
            }
        ],
    }
);