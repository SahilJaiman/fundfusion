import smartpy as sp

class PostLedger:
    def get_type():
        return sp.TRecord(
                id = sp.TNat,
                author = sp.TAddress,
                title = sp.TString,
                desc = sp.TString,
                type = sp.TString,
                thumbnail_url = sp.TString,
                content_url = sp.TString,
                timestamp = sp.TTimestamp,
                fundraising_goal = sp.TMutez,
                fundraised = sp.TMutez,
                upvotes = sp.TNat,
                downvotes = sp.TNat,  
                active = sp.TBool,
                deadline = sp.TTimestamp,
                total_withdraw_amt = sp.TMutez,
                contributors = sp.TMap(sp.TAddress,sp.TRecord(amt = sp.TMutez,timestamp = sp.TTimestamp)))

class FundFusion(sp.Contract):
    def __init__(self):
        # Storage
        self.init_storage(
            admin = sp.address("tz1WT1Lm3giwXCQ3Q1dVANjhrS2Nv1L9SHim"),
            posts = sp.big_map(l = {}, tkey = sp.TNat, tvalue = PostLedger.get_type()),
            next_count = sp.nat(0)
        )
        
    def is_admin(self, sender):
        sp.verify(sender == self.data.admin, message = 'NOT_ADMIN')

    @sp.entry_point
    def create_post(self, content_url, thumbnail_url, title, desc, type, fr_goal,deadline):
        sp.set_type(content_url, sp.TString)
        sp.set_type(title, sp.TString)
        sp.set_type(desc, sp.TString)
        sp.set_type(type, sp.TString)
        sp.set_type(thumbnail_url, sp.TString)
        sp.set_type(fr_goal, sp.TMutez)
        sp.set_type(deadline,sp.TTimestamp)
 
        self.data.posts[self.data.next_count] = sp.record(
            id = self.data.next_count,
            author = sp.sender,
            content_url = content_url,
            thumbnail_url = thumbnail_url,
            title = title,
            desc = desc,
            type = type,
            timestamp = sp.now,
            fundraising_goal = fr_goal,
            fundraised = sp.mutez(0),
            upvotes = sp.nat(0),
            downvotes = sp.nat(0),
            active = sp.bool(True),
            deadline = deadline,
            total_withdraw_amt = sp.mutez(0),
            contributors = sp.map(l={}, tkey=sp.TAddress, tvalue = sp.TRecord(
                                           amt = sp.TMutez,
                                           timestamp = sp.TTimestamp))
                                           
        )
        self.data.next_count += 1

    @sp.entry_point
    def contribute(self, post_id):
        sp.set_type(post_id, sp.TNat)
        sp.verify(self.data.posts.contains(post_id), "POST DOES NOT EXIST")
        post = self.data.posts[post_id]

        sp.verify(post.active==True, "BLOCK NOT ACTIVE")
        sp.verify(sp.sender != post.author, "AUTHOR CANNOT TIP OWN POSTS")
        sp.verify(post.deadline>=sp.now,"CAN'T CONTRIBUTE AFTER DEADLINE")

        contributors = post.contributors
        contribute_amt = sp.local("contribute_amt", sp.amount)
        post.fundraised += contribute_amt.value
        
        sp.if contributors.contains(sp.sender):
            contribute_amt.value += contributors[sp.sender].amt
        
        new_record = sp.record(
                amt = contribute_amt.value ,
                timestamp = sp.now)
        contributors[sp.sender] = new_record

    @sp.entry_point
    def withdraw(self,params):
        sp.set_type(params.post_id, sp.TNat)
        sp.set_type(params.amt,sp.TMutez)
        sp.verify(self.data.posts.contains(params.post_id), "POST DOES NOT EXIST")
        post = self.data.posts[params.post_id]
        sp.verify(post.active, "BLOCK NOT ACTIVE")
        sp.verify(sp.sender == post.author, "ONLY AUTHOR CAN WITHDRAW THE FUNDS")
        sp.verify(post.fundraised-post.total_withdraw_amt>=params.amt,"INVALID AMOUNT")

        sp.send(post.author,params.amt)
        post.total_withdraw_amt += params.amt;

    
        
@sp.add_test(name="main")
def main():
    scenario = sp.test_scenario()
    
    cont = FundFusion()
    scenario += cont

    admin = sp.address("tz1VLj6WqWLeFjn4BWdoScpN752qSEyqwXFV")
    bob = sp.test_account ("bob")
    alice = sp.test_account ("alice")

    cont.create_post(
        content_url="https://ipfs.io/ipfs/QmPJMWKwHrgvLdRvrp7GcHtr4xPK3kNbpsDSSr2nPnP76o",
        thumbnail_url="https://www.pmcares.gov.in/assets/donation/images/PMCARES_FB1.jpg",
        title="PM CARE FUND",
        desc = "PM CARES (Prime Minister's Citizen Assistance and Relief in Emergency Situations) Fund",
        type = "Donation",
        fr_goal = sp.tez(21000),
        deadline = sp.timestamp(1689806531)
    ).run(sender = admin)

    cont.contribute(0).run(sender=alice, amount=sp.tez(5))
    cont.contribute(0).run(sender=bob, amount=sp.tez(3))
    cont.contribute(0).run(sender=alice, amount=sp.tez(2))
    cont.contribute(0).run(sender=bob, amount=sp.tez(2))
    cont.withdraw(amt = sp.tez(1),post_id = 0).run(sender=bob,valid = False)
    cont.withdraw(amt = sp.tez(1),post_id = 0).run(sender=admin)
    cont.withdraw(amt = sp.tez(11),post_id = 0).run(sender=admin)
    cont.contribute(0).run(sender=alice, amount=sp.tez(3))
    cont.withdraw(amt = sp.tez(1),post_id = 0).run(sender=admin)
    

    sp.add_compilation_target("My Contract", FundFusion())