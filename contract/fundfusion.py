import smartpy as sp

class PostLedger:
    def get_type():
        return sp.TRecord(
                author = sp.TAddress,
                title = sp.TString,
                campaignType = sp.TString,
                thumbnail_url = sp.TString,
                ipfs_url = sp.TString,
                timestamp = sp.TTimestamp,
                fundraising_goal = sp.TMutez,
                fundraised = sp.TMutez,
                contributers = sp.TMap(sp.TAddress, sp.TMutez)
            )

class Contract(sp.Contract):
    def __init__(self):
        # Storage
        self.init_storage(
            admin = sp.address("tz1WT1Lm3giwXCQ3Q1dVANjhrS2Nv1L9SHim"),
            posts = sp.big_map(l = {}, tkey = sp.TNat, tvalue = PostLedger.get_type()),
            next_count = sp.nat(0)
        )


    @sp.entry_point
    def create_post(self, ipfs_url, thumbnail_url, title,campaignType, fr_goal):
        sp.set_type(ipfs_url, sp.TString)
        sp.set_type(title, sp.TString)
        sp.set_type(campaignType, sp.TString)
        sp.set_type(thumbnail_url, sp.TString)
        sp.set_type(fr_goal, sp.TMutez)
 
        self.data.posts[self.data.next_count] = sp.record(
            author = sp.sender,
            ipfs_url = ipfs_url,
            thumbnail_url = thumbnail_url,
            title = title,
            campaignType = campaignType,
            timestamp = sp.now,
            fundraising_goal = fr_goal,
            fundraised = sp.mutez(0),
            contributers = sp.map(l={}, tkey=sp.TAddress, tvalue = sp.TMutez)
        )
        self.data.next_count += 1

    @sp.entry_point
    def send_tip(self, post_id):
        sp.set_type(post_id, sp.TNat)

        sp.verify(self.data.posts.contains(post_id), "POST DOES NOT EXIST")
        post = self.data.posts[post_id]
        sp.verify(sp.sender != post.author, "AUTHOR CANNOT TIP OWN POSTS")

        contributers = post.contributers

        contribute_amt = sp.local("contribute_amt", sp.amount)
        sp.send(post.author,contribute_amt.value)
        post.fundraised += contribute_amt.value
        sp.if contributers.contains(sp.sender):
            contribute_amt.value += contributers[sp.sender]
        contributers[sp.sender] = contribute_amt.value



        

@sp.add_test(name="main")
def main():
    scenario = sp.test_scenario()
    
    cont = Contract()
    scenario += cont

    weeblet = sp.address("tz1VLj6WqWLeFjn4BWdoScpN752qSEyqwXFV")
    bob = sp.test_account ("bob")
    alice = sp.test_account ("alice")

    cont.create_post(
        ipfs_url="ok",
        thumbnail_url="ok",
        title="Demo Post",
        campaignType="Donation",
        fr_goal = sp.tez(50)
    ).run(sender = weeblet)

    cont.send_tip(0).run(sender=alice, amount=sp.mutez(10000))
    cont.send_tip(0).run(sender=bob, amount=sp.tez(1))
    cont.send_tip(0).run(sender=alice, amount=sp.tez(2), valid=False)
    cont.send_tip(0).run(sender=bob, amount=sp.tez(2))